export type Role = "startup" | "agency" | "brand" | "institutional" | "curator";

export interface User {
  id: string;
  telegram_id: string;
  telegram_handle: string;
  role: Role;
  xp: number;
  badges: string[];
  telegram_channel_joined: boolean;
  telegram_group_joined: boolean;
  created_at: string;
}

export interface Startup {
  id: string;
  user_id: string;
  name: string;
  one_liner: string;
  vertical: string;
  capabilities: string[];
  tech_stack: string;
  pilot_30: string;
  pilot_60: string;
  pilot_90: string;
  ideal_client: string;
  xp: number;
  badges: string[];
  match_score?: number;
}

export interface Challenge {
  id: string;
  type: "brand" | "agency" | "sponsor" | "ecosystem";
  title: string;
  description: string;
  vertical: string;
  xp_reward: number;
  created_by: string;
  created_at: string;
}

export interface ChallengeResponse {
  id: string;
  challenge_id: string;
  startup_id: string;
  proposal: string;
  kpi: string;
  demo_link: string;
  votes: number;
  created_at: string;
}

export interface Meeting {
  id: string;
  requester_id: string;
  startup_id: string;
  objective: string;
  message: string;
  status: "pending" | "accepted" | "declined";
  created_at: string;
}

export interface Recommendation {
  id: string;
  recommender_id: string;
  startup_id: string;
  fit: string;
  justification: string;
  xp_awarded: number;
  created_at: string;
}

export interface RankingEntry {
  id: string;
  name: string;
  type: "ecosystem" | "startup" | "agency" | "brand";
  xp: number;
  startups?: number;
  proposals?: number;
  meetings?: number;
}

export type Screen =
  | "onboarding"
  | "role-matrix"
  | "role-database"
  | "home"
  | "quests"
  | "challenges"
  | "scout"
  | "rankings"
  | "rewards"
  | "profile-page"
  | "promotion-page"
  | "challenge-page"
  | "badges-page"
  | "community-page"
  | "event-page"
  | "ecosystem-challenge"
  | "founder-challenge"
  | "role-quest"
  | "agency-quest-page"
  | "brand-quest-page"
  | "institutional-quest-page"
  | "challenge-detail"
  | "challenge-response"
  | "challenge-retail"
  | "challenge-agency"
  | "challenge-create"
  | "startup-detail"
  | "startup-ugc"
  | "startup-match"
  | "meeting-page"
  | "agency-dashboard"
  | "ecosystem-dashboard"
  | "ecosystem-detail"
  | "award-content-ai"
  | "award-cx-ai"
  | "award-ecosystem"
  | "awards-vote"
  | "awards-recommend"
  | "access-flow"
  | "sponsor-page"
  | "capabilities-page"
  | "pilot-page"
  | "invite-page"
  | "quest-profile";
