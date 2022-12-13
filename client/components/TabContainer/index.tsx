import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Box from '@mui/material/Box'
import { CoinPriceObj } from '@/types/CoinPriceTypes'
import {
  Dispatch,
  SetStateAction,
  ReactNode,
  Children,
  isValidElement
} from 'react'

export interface TabProps {
  tabLabelInfo?: string
  priceInfo?: CoinPriceObj
}
interface TabContainerProps {
  selectedTab: number
  setSelectedTab: Dispatch<SetStateAction<number>>
  children: ReactNode
}
interface TabPanelProps {
  children?: ReactNode
  index: number
  value: number
}

function TabPanel({ children, value, index, ...other }: TabPanelProps) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      <Box>{children}</Box>
      {/* {value === index && <Box>{children}</Box>} */}
    </div>
  )
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`
  }
}

export default function TabContainer({
  selectedTab,
  setSelectedTab,
  children
}: TabContainerProps) {
  // const [selectedTab, setSelectedTab] = React.useState<number>(0)
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue)
  }
  return (
    <Box sx={{ width: '100%', height: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs
          value={selectedTab}
          onChange={handleChange}
          variant="fullWidth"
          aria-label="basic tabs example"
        >
          {Children.map(children, (child, index) => {
            if (!isValidElement(child)) {
              console.error('올바른 리액트 노드가 아님')
              return false
            }
            return (
              <Tab
                label={child.props.tabLabelInfo || '상세정보'}
                {...a11yProps(index)}
              />
            )
          })}
        </Tabs>
      </Box>
      {Children.map(children, (child, index) => {
        if (!isValidElement(child)) {
          console.error('올바른 리액트 노드가 아님')
          return false
        }
        return (
          <TabPanel value={selectedTab} index={index}>
            {child}
          </TabPanel>
        )
      })}
    </Box>
  )
}
