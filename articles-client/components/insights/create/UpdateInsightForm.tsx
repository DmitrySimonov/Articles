import { zodResolver } from '@hookform/resolvers/zod';
import { getPreSignedFileUrl, uploadFile } from '@/articles-client/api/actions';
import { useGetInsight, usePublishInsight, useUpdateInsight } from '@/articles-client/api/hooks';
import { ICreateInsightForm } from '@/articles-client/articles/types/create-insight';
import {
  InsightSettingsSelectProps,
  InsightSymbolSelectProps,
} from '@/articles-client/articles/types/create-insight-form';
import { InsightSettings } from '@/articles-client/components';
import { ArticleMarketDirection } from '@/articles-shared/api';
import { Article, File as ArticleFile, FILE_TYPE } from '@/articles-shared/api/types/articles';
import { Text } from '@/client-base/ui';
import { DnDUploader } from '@/client-base/ui/DnDUploader';
import { ErrorText } from '@/client-base/ui/ErrorText';
import { Form, FormField } from '@/client-base/ui/form';
import { TextInput } from '@/client-base/ui/inputs';
import { Skeleton } from '@/client-base/ui/Skeleton';
import { showToast } from '@/client-base/ui/toast';
import { fetchJsonFile } from '@/client-base/utils/fetchJsonFile';
import { urlToFile } from '@/client-base/utils/urlToFile';
import { AxiosError } from 'axios';
import { debounce, isEqual } from 'lodash';
import { Value } from 'plate-editor/src/types';
import { Suspense, lazy, useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';

const PlateEditor = lazy(() => import('plate-editor/src/components/plate-editor'));

const DEFAULT_VALUE = [
  {
    type: 'p',
    children: [
      {
        text: '',
      },
    ],
  },
];

const schema = z
  .object({
    marketDirection: z.nativeEnum(ArticleMarketDirection).refine((val) => val !== undefined, {
      message: 'Market direction is required',
    }),
    file: z.instanceof(File).optional(),
    editorContent: z.array(z.any()).optional(),
    title: z.string().min(1, { message: 'Title is required' }),
    summary: z.string().min(1, { message: 'Summary is required' }),
    price: z.number({ invalid_type_error: 'Price is required' }).positive({ message: 'Price must be positive' }),
    symbols: z.array(z.object({})).min(1, { message: 'At least one stock should be selected' }),
    sector: z.string().min(1, { message: 'Sector is required' }),
  })
  .superRefine((data, ctx) => {
    if (!data.file && !data.editorContent) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Either file or editor content must be provided.',
        path: ['editorContent'],
      });
    }
  });

type CreateProfileFormProps = {
  symbolSelect: React.ComponentType<InsightSymbolSelectProps>;
  sectorSelect: React.ComponentType<InsightSettingsSelectProps>;
  articleId: string | undefined;
};

export function UpdateInsightForm({ symbolSelect, sectorSelect, articleId }: CreateProfileFormProps) {
  const [isFormSet, setIsFormSet] = useState(false);

  const { data: article, isLoading } = useGetInsight(articleId);

  const { trigger } = useUpdateInsight(article?._id);
  const { trigger: triggerPublish } = usePublishInsight(article?._id);

  const form = useForm<ICreateInsightForm>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: '',
      symbols: [],
    },
    mode: 'onBlur',
  });

  const editorContent = form.watch('editorContent');
  const uploaderContent = form.watch('file');

  const handleEditorContent = async (value: any, article: any) => {
    if (editorContent && isEqual(editorContent, DEFAULT_VALUE)) return;

    const jsonContent = JSON.stringify(value);
    const blob = new Blob([jsonContent], { type: 'application/json' });
    const { fileUrl, fileName } = await uploadFile(blob, 'application/json', article?._id);

    const contentFile: ArticleFile = {
      fileUrl: fileUrl,
      fileName: fileName,
      mimeType: 'application/json',
    };

    if (!article.type || article?.type !== FILE_TYPE.EDITOR) {
      handleUpdateRow('type', FILE_TYPE.EDITOR);
    }

    handleUpdateRow('file', contentFile);
  };

  const handleFile = async (value: any, article: any) => {
    const blob = new Blob([value], { type: value.type });
    const { fileUrl, fileName } = await uploadFile(blob, value.type, article?._id);

    const contentFile: ArticleFile = {
      fileUrl: fileUrl,
      fileName: fileName,
      mimeType: value.type,
    };

    if (!article.type || article?.type !== FILE_TYPE.PDF) {
      handleUpdateRow('type', FILE_TYPE.PDF);
    }

    handleUpdateRow('file', contentFile);
  };

  const debouncedWatchHandler = debounce(async (name, value: any) => {
    if (!name || !article) return;

    switch (name) {
      case 'editorContent':
        await handleEditorContent(value, article);
        break;
      case 'file':
        await handleFile(value, article);
        break;
      case 'price':
        handleUpdateRow('price', value * 100);
        break;
      default:
        handleUpdateRow(name, value);
        break;
    }
    showToast('The article was saved!', { type: 'success' });
  }, 1000);

  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (!name) return;
      debouncedWatchHandler(name, value[name as keyof ICreateInsightForm]);
    });
    return () => subscription.unsubscribe();
  }, [article, form.watch]);

  useEffect(() => {
    if (article && !isFormSet) {
      const setForm = async () => {
        let file = undefined;
        form.reset({
          marketDirection: article?.marketDirection,
          title: article?.title,
          summary: article?.summary,
          symbols: article?.symbols || [],
          sector: article.sector,
          price: article?.price ? article?.price / 100 : undefined,
        });

        if (article?.file) {
          if (article?.type === FILE_TYPE.EDITOR) {
            const fileUrl = await getPreSignedFileUrl(article._id);
            file = await fetchJsonFile(fileUrl.url);
            form.setValue('editorContent', file);
          }

          if (article?.type === FILE_TYPE.PDF) {
            const fileUrl = await getPreSignedFileUrl(article._id);
            file = await urlToFile(fileUrl.url, article.file.fileName, article.file.mimeType);
            form.setValue('file', file);
          }
        }
      };
      setForm().then(() => {
        setIsFormSet(true);
      });
    }
  }, [article, isFormSet]);

  const handleUpdateRow = (key: keyof Article, value: any) => {
    if (!key) return;

    const payload = {
      [key]: value,
    };

    trigger(payload);
  };

  const handleRemoveFile = () => {
    handleUpdateRow('file', null);
    handleUpdateRow('type', null);

    form.reset({ file: undefined });
  };

  const onSubmit: SubmitHandler<ICreateInsightForm> = async () => {
    const isEditorContentDefault = editorContent && isEqual(editorContent, DEFAULT_VALUE);
    if (isEditorContentDefault) {
      return;
    }
    try {
      await triggerPublish();
      showToast('The article was published successfully!', { type: 'success' });
    } catch (error) {
      if (error instanceof AxiosError) {
        const message = error.response?.data?.message || 'Unknown error';
        showToast(`Failed: ${message}`, { type: 'error', duration: 5000 });
      } else {
        showToast('An unexpected error occurred.', {
          type: 'error',
          duration: 5000,
        });
      }
    }
  };

  const onChangeHandler = (value: Value) => {
    if (value === editorContent) return;
    form.setValue('editorContent', value);
  };

  const errors = form.formState.errors;

  const getIsFilled = (key: FILE_TYPE) => {
    const isEditorContentDefault = editorContent && isEqual(editorContent, DEFAULT_VALUE);

    if (!editorContent && !uploaderContent) {
      return true;
    }

    switch (key) {
      case FILE_TYPE.PDF:
        return isEditorContentDefault || !!uploaderContent;
      case FILE_TYPE.EDITOR:
        return !uploaderContent && !!editorContent;
      default:
        return false;
    }
  };

  const getOr = () => {
    if (uploaderContent) {
      return false;
    }
    return !editorContent || isEqual(editorContent, DEFAULT_VALUE);
  };

  return (
    <Form {...form}>
      {isLoading ? 'loading' : null}
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex items-start w-full h-full gap-x-6 font-secondary">
        <div className="flex flex-col w-full">
          <div className="flex flex-col w-full mb-4">
            <FormField
              name="title"
              control={form.control}
              render={({ field }) => (
                <TextInput
                  placeholder="Add your Title"
                  className="bg-form-input-primary"
                  inputClassName="font-secondary text-sm"
                  {...field}
                />
              )}
            />
            {errors.title?.message && <ErrorText>{errors.title?.message}</ErrorText>}
          </div>
          {getIsFilled(FILE_TYPE.PDF) && (
            <DnDUploader
              value={uploaderContent}
              onUpload={(file: File) => form.setValue('file', file)}
              onRemove={() => handleRemoveFile()}
            />
          )}
          {getOr() && (
            <div className="flex items-center w-full my-4 gap-x-2">
              <div className="w-full h-[1px] bg-table-divider"></div>
              <div className="flex px-4 py-1 border border-table-divider rounded-[40px]">
                <Text className="text-general-light/60" size="xs" font="secondary">
                  OR
                </Text>
              </div>
              <div className="w-full h-[1px] bg-table-divider"></div>
            </div>
          )}
          {getIsFilled(FILE_TYPE.EDITOR) && (
            <div className="w-full font-editor">
              <Suspense fallback={<Skeleton className="h-[500px] w-full" />}>
                <PlateEditor
                  plateKey={editorContent ? 'plate' : JSON.stringify(DEFAULT_VALUE) || 'test'}
                  initialValue={editorContent}
                  readOnly={false}
                  onChangeHandler={onChangeHandler}
                />
              </Suspense>
            </div>
          )}
          {(errors?.editorContent || errors?.file) && (
            <div className="flex mt-2">
              <ErrorText>{errors?.editorContent?.message || errors?.file?.message}</ErrorText>
            </div>
          )}
        </div>
        <InsightSettings symbolSelect={symbolSelect} sectorSelect={sectorSelect} form={form} />
      </form>
    </Form>
  );
}
