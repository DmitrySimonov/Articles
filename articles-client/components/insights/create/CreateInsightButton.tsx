import { Routes } from '@/client-base/constants/Routes';
import { FlatButton } from '@/client-base/ui';

import { CreateArticleOptions } from '@/articles-shared/api/types/articles';
import { showToast } from '@/client-base/ui/toast';
import { Profile } from '@/shared/types/core/profile';
import { useNavigate, useParams } from 'react-router-dom';
import { useCreateInsight } from '../../../api';

type Props = {
  profile: Profile | undefined;
};

export const CreateInsightButton = ({ profile }: Props) => {
  const navigate = useNavigate();

  const { id } = useParams();

  const { trigger } = useCreateInsight();

  if (id) {
    return null;
  }
  const handleButtonClick = async () => {
    if (!profile) return;
    try {
      const payload: CreateArticleOptions = {
        userProfile: {
          firstName: profile.firstName,
          lastName: profile.lastName,
          pronounce: profile.pronounce,
          updatedAt: new Date(),
        },
      };
      const article = await trigger(payload);
      navigate(`/${Routes.research}/${Routes.researchMyInsights}/${article._id}`);
    } catch (error) {
      showToast(`Failed to create insight`, { type: 'error', duration: 5000 });
    }
  };

  return (
    <FlatButton
      className="group flex justify-center items-center w-auto transition-all duration-300 rounded-md px-4 py-2 disabled:border-general-light/30 border border-brand-primary"
      title="Create Insight"
      titleClassName="text-sm"
      onClick={handleButtonClick}
    />
  );
};
