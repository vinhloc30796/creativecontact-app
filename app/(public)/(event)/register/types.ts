import { IndustryType, ExperienceType } from '@/drizzle/schema/user';

export interface ProfessionalInfoData {
  industryExperiences: {
    industry: IndustryType;
    experienceLevel: ExperienceType;
  }[];
} 