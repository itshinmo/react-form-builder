import { Box, Tab, Tabs } from "@mui/material";
import * as React from "react";
import type { SystemSx } from "shared/types";
import type { TabName, TabState } from "../types";

type Props = {
  tabs: TabState[];
};

const tabsContainer: SystemSx = theme => ({
  borderBottom: `2px solid ${theme.palette.divider}`,
  width: "100%",
  height: theme.spacing(9),
  position: "sticky",
  backgroundColor: theme.palette.background.default,
  top: 0,
  zIndex: theme.zIndex.appBar,
});

type TabPanelProps = {
  tabName: TabName;
  currentActiveTab: TabName;
  tabContent: JSX.Element;
};

const TabPanel = (props: TabPanelProps) => {
  const { tabName, currentActiveTab, tabContent } = props;

  if (currentActiveTab !== tabName) return null;

  return (
    <Box
      role="tabpanel"
      id={`tabpanel-${tabName}`}
      aria-labelledby={`tab-${tabName}`}
      height="100%"
    >
      {tabContent}
    </Box>
  );
};

const PageTabs = (props: Props) => {
  const { tabs } = props;

  const [currentActiveTab, setCurrentActiveTab] =
    React.useState<TabName>("settings");

  const handleTabChange = (_event: React.SyntheticEvent, newTab: TabName) => {
    setCurrentActiveTab(newTab);
  };

  return (
    <>
      <Tabs
        centered
        sx={tabsContainer}
        value={currentActiveTab}
        onChange={handleTabChange}
      >
        {tabs.map(tab => (
          <Tab
            key={tab.name}
            value={tab.name}
            label={tab.name}
            id={`tab-${tab.name}`}
            aria-controls={`tabpanel-${tab.name}`}
            icon={tab.icon}
          />
        ))}
      </Tabs>

      <Box>
        {tabs.map(tab => (
          <TabPanel
            key={tab.name}
            tabName={tab.name}
            currentActiveTab={currentActiveTab}
            tabContent={tab.tabContent}
          />
        ))}
      </Box>
    </>
  );
};

export default PageTabs;
