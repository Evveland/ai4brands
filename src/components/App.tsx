"use client";

import { useAppState } from "@/lib/store";
import { TopBar } from "@/components/TopBar";
import { BottomNav } from "@/components/BottomNav";
import { TelegramInit } from "@/components/TelegramInit";
import { Home } from "@/components/screens/Home";
import { Challenges } from "@/components/screens/Challenges";
import { StartupQuestPage } from "@/components/quest/StartupQuestPage";
import { AgencyQuestPage } from "@/components/quest/AgencyQuestPage";
import { BrandQuestPage } from "@/components/quest/BrandQuestPage";
import { InstitutionalQuestPage } from "@/components/quest/InstitutionalQuestPage";
import { MediaQuestPage } from "@/components/quest/MediaQuestPage";
import { UniversityQuestPage } from "@/components/quest/UniversityQuestPage";
import { InvestorQuestPage } from "@/components/quest/InvestorQuestPage";
import { Scout } from "@/components/screens/Scout";
import { Rankings } from "@/components/screens/Rankings";
import { Rewards } from "@/components/screens/Rewards";
import {
  RoleMatrix,
  Quests,
  AccessFlow,
  ChallengeDetail,
  ChallengeResponse,
  ChallengeCreate,
  StartupDetail,
  MeetingPage,
  EventPage,
  EcosystemChallenge,
  FounderChallenge,
  InvitePage,
  ProfilePage,
  BadgesPage,
  CommunityPage,
  AgencyDashboard,
  AwardsVote,
  AwardsRecommend,
} from "@/components/screens/InnerScreens";

const INNER_SCREENS = new Set([
  "role-matrix", "role-database", "quest-profile", "capabilities-page",
  "startup-quest", "agency-quest", "brand-quest", "institutional-quest",
  "media-quest", "university-quest", "investor-quest",
  "pilot-page", "invite-page", "challenge-detail", "challenge-response",
  "challenge-retail", "challenge-agency", "challenge-create", "startup-detail",
  "startup-ugc", "startup-match", "meeting-page", "agency-dashboard",
  "ecosystem-dashboard", "ecosystem-detail", "founder-challenge", "event-page",
  "ecosystem-challenge", "sponsor-page", "access-flow", "award-content-ai",
  "award-cx-ai", "award-ecosystem", "awards-vote", "awards-recommend",
  "profile-page", "promotion-page", "challenge-page", "badges-page",
  "community-page", "agency-quest-page", "brand-quest-page",
  "institutional-quest-page", "role-quest",
]);

function ScreenRenderer() {
  const { screen } = useAppState();

  switch (screen) {
    case "home": return <Home />;
    case "startup-quest": return <StartupQuestPage />;
    case "agency-quest": return <AgencyQuestPage />;
    case "brand-quest": return <BrandQuestPage />;
    case "media-quest": return <MediaQuestPage />;
    case "university-quest": return <UniversityQuestPage />;
    case "investor-quest": return <InvestorQuestPage />;
    case "institutional-quest": return <InstitutionalQuestPage />;
    case "quests":
    case "role-quest": return <Quests />;
    case "challenges": return <Challenges />;
    case "scout": return <Scout />;
    case "rankings": return <Rankings />;
    case "rewards": return <Rewards />;
    case "role-matrix": return <RoleMatrix />;
    case "access-flow": return <AccessFlow />;
    case "challenge-detail": return <ChallengeDetail />;
    case "challenge-response":
    case "challenge-retail":
    case "challenge-agency": return <ChallengeResponse />;
    case "challenge-create": return <ChallengeCreate />;
    case "startup-detail":
    case "startup-ugc":
    case "startup-match": return <StartupDetail />;
    case "meeting-page": return <MeetingPage />;
    case "event-page": return <EventPage />;
    case "ecosystem-challenge": return <EcosystemChallenge />;
    case "founder-challenge": return <FounderChallenge />;
    case "invite-page": return <InvitePage />;
    case "profile-page":
    case "quest-profile":
    case "capabilities-page":
    case "pilot-page": return <ProfilePage />;
    case "badges-page": return <BadgesPage />;
    case "community-page": return <CommunityPage />;
    case "agency-dashboard":
    case "ecosystem-dashboard": return <AgencyDashboard />;
    case "awards-vote": return <AwardsVote />;
    case "awards-recommend": return <AwardsRecommend />;
    default:
      return <Home />;
  }
}

export function App() {
  const { screen } = useAppState();
  const isInner = INNER_SCREENS.has(screen);

  return (
    <>
    <TelegramInit />
    <div
      className="w-full max-w-[430px] mx-auto min-h-screen relative px-4 pb-[92px] pt-4"
      style={{ background: "linear-gradient(180deg,rgba(255,255,255,.02),rgba(255,255,255,0))" }}
    >
      {!isInner && <TopBar />}
      <ScreenRenderer />
      <BottomNav />
    </div>
    </>
  );
}
