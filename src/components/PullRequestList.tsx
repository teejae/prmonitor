import styled from "@emotion/styled";
import { observer } from "mobx-react-lite";
import React, { useState } from "react";
import { EnrichedPullRequest } from "../filtering/enriched-pull-request";
import { PullRequest } from "../storage/loaded-state";
import { MuteType } from "../storage/mute-configuration";
import { Link } from "./design/Link";
import { Paragraph } from "./design/Paragraph";
import { Loader } from "./Loader";
import { PullRequestItem } from "./PullRequestItem";

const List = styled.div`
  border: 1px solid #ddd;
  border-radius: 0 8px 8px 8px;
  background: #fff;
  margin-bottom: 16px;
`;

const NewCommitsToggle = styled.label`
  padding: 8px;
  margin: 0;
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const WhitelistedTeamsToggle = styled.label`
  padding: 8px;
  margin: 0;
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const NewCommitsCheckbox = styled.input`
  margin-right: 8px;
`;

const OnlyDirectRequestsCheckbox = styled.input`
  margin-right: 8px;
`;

const WhitelistedTeamsInput = styled.input`
  flex-grow: 1;
  padding: 4px 8px;
  margin-right: 8px;

  &:focus {
    outline-color: #2ee59d;
  }
`;

const OpenAllParagraph = styled(Paragraph)`
  text-align: center;
  color: #777;
`;

export interface PullRequestListProps {
  pullRequests: EnrichedPullRequest[] | null;
  emptyMessage: string;
  mutingConfiguration: "allow-muting" | "allow-unmuting" | "none";
  newCommitsNotificationToggled: boolean | null;
  onlyDirectRequestsToggled: boolean | null;
  onToggleNewCommitsNotification?(): void;
  onToggleOnlyDirectRequests?(): void;
  onChangeWhitelistedTeams?: (text: string)=>void;
  onOpenAll(): void;
  onOpen(pullRequestUrl: string): void;
  onMute(pullRequest: PullRequest, muteType: MuteType): void;
  onUnmute(pullRequest: PullRequest): void;
}

export const PullRequestList = observer((props: PullRequestListProps) => {
  const [whitelistedTeams, setWhitelistedTeams] = useState('')
  const handleWhitelistedTeamsChange = (evt: any) => {
    console.log('handleWhitelistedTeamsChange', evt);
    setWhitelistedTeams(evt.target.value);
    props.onChangeWhitelistedTeams && props.onChangeWhitelistedTeams(whitelistedTeams);
  }
  return (
  <List>
    {props.newCommitsNotificationToggled !== null && (
      <NewCommitsToggle>
        <NewCommitsCheckbox
          type="checkbox"
          checked={props.newCommitsNotificationToggled}
          onChange={props.onToggleNewCommitsNotification}
        />
        Notify me of new commits
      </NewCommitsToggle>
    )}
    {props.onlyDirectRequestsToggled !== null && (
      <div>
      <WhitelistedTeamsToggle>
        <OnlyDirectRequestsCheckbox
          type="checkbox"
          checked={props.onlyDirectRequestsToggled}
          onChange={props.onToggleOnlyDirectRequests}
        />
        Only include whitelisted teams
      </WhitelistedTeamsToggle>
      {props.onlyDirectRequestsToggled && props.onChangeWhitelistedTeams && (
          <WhitelistedTeamsInput
            type="text"
            placeholder="team1, team2"
            value={whitelistedTeams}
            onBlur={handleWhitelistedTeamsChange}
            ></WhitelistedTeamsInput>)}
      </div>
    )}
    {props.pullRequests === null ? (
      <Loader />
    ) : props.pullRequests.length === 0 ? (
      <Paragraph>{props.emptyMessage}</Paragraph>
    ) : (
      <>
        {props.pullRequests.map((pullRequest) => (
          <PullRequestItem
            key={pullRequest.nodeId}
            pullRequest={pullRequest}
            mutingConfiguration={props.mutingConfiguration}
            onOpen={props.onOpen}
            onMute={props.onMute}
            onUnmute={props.onUnmute}
          />
        ))}
        {props.pullRequests.length > 1 && (
          <OpenAllParagraph>
            <Link onClick={props.onOpenAll}>Open them all</Link>
          </OpenAllParagraph>
        )}
      </>
    )}
  </List>
);
        });
