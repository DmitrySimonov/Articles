import { Suspense, lazy, useEffect, useState } from 'react';
import { twm } from '@/client-base/utils/twm';
import { SymbolBadge } from '@/client-base/ui/SymbolBadge';
import { Skeleton, Tag } from '@/client-base/ui';
// import { FormButton } from '@/client-base/ui/buttons/FormButton'; // TEMPORARY DISABLED
// import { formatPrice } from '@/client-base/utils/formatPrice'; // TEMPORARY DISABLED
import { RoundedBox, Text } from '@/client-base/ui';
import { Article, ArticleMarketDirection, FILE_TYPE_ENUM } from '@/articles-shared/api';
import { getPreSignedFileUrl } from '@/articles-client/api/actions';
import { fetchJsonFile } from '@/client-base/utils/fetchJsonFile';
import { Value } from 'plate-editor/src/types';

const PlateEditor = lazy(() => import('plate-editor/src/components/plate-editor'));

type Props = {
  insight?: Article | undefined;
  className?: string;
};

export const InsightDetails = ({ insight, className }: Props) => {
  const [editorContent, setEditorContent] = useState<Value | null>(null);
  const [pdf, setPdf] = useState<string | null>(null);
  const isEditorContent = insight?.type === FILE_TYPE_ENUM.EDITOR;

  useEffect(() => {
    if (!insight) return;
    fetchContent();
  }, [insight]);

  const getDirectionColor = (marketDirection: ArticleMarketDirection) => {
    switch (marketDirection) {
      case ArticleMarketDirection.BEARISH:
        return 'text-status-bearish';
      case ArticleMarketDirection.BULLISH:
        return 'text-status-bullish';
      case ArticleMarketDirection.NEUTRAL:
        return 'text-neutral';
      default:
        return 'text-general-light';
    }
  };

  const fetchContent = async () => {
    if (!insight) return;
    const fileUrl = await getPreSignedFileUrl(insight._id);
    if (isEditorContent) {
      const data = await fetchJsonFile(fileUrl.url);
      setEditorContent(data);
    } else {
      setPdf(fileUrl.url);
    }
  };

  return (
    <div className={twm('w-full flex flex-col', className)}>
      <RoundedBox className="flex flex-col mb-4">
        <div className="flex items-center gap-x-3.5 mb-5">
          {insight?.symbols &&
            insight?.symbols?.length > 0 &&
            insight?.symbols.map((s) => <SymbolBadge key={s.ric} symbol={s.symbol} />)}
          {insight?.marketDirection && (
            <Text size="sm" className={twm('capitalize', getDirectionColor(insight.marketDirection))}>
              {insight.marketDirection}
            </Text>
          )}
        </div>
        <Text size="2xl" className="text-brand-primary font-medium mb-5">
          {insight?.title}
        </Text>
        <div className="flex">{insight?.sector && <Tag title={insight.sector} />}</div>
      </RoundedBox>
      <RoundedBox className="flex flex-col mb-4">
        <Text size="xl" font="secondary" className="text-brand-primary font-medium mb-5">
          Preview
        </Text>
        <Text size="2xs" className="text-general-light pb-5">
          {insight?.summary}
        </Text>
      </RoundedBox>
      {/* // TEMPORARY DISABLED */}
      {/* {insight?.price && <FormButton
        titleClassName="uppercase"
        title={`Purchase for $${formatPrice(insight.price)}`}
      />} */}
      {isEditorContent && editorContent && (
        <div className="w-full font-editor">
          <Suspense fallback={<Skeleton className="h-[500px] w-full" />}>
            <PlateEditor
              plateKey={'plate'}
              initialValue={editorContent ?? undefined}
              readOnly
              onChangeHandler={() => undefined}
            />
          </Suspense>
        </div>
      )}
      {!isEditorContent && pdf && (
        <div className="flex w-full h-screen">
          <iframe src={pdf} width="100%" height="100%" style={{ borderRadius: '10px' }} />
        </div>
      )}
    </div>
  );
};
