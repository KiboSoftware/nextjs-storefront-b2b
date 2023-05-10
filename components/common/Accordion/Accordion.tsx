import * as React from 'react'

import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import Accordion from '@mui/material/Accordion'
import AccordionDetails from '@mui/material/AccordionDetails'
import AccordionSummary from '@mui/material/AccordionSummary'
import Typography from '@mui/material/Typography'

interface AccordionProps {
  title: string
  content: string
  disabled: boolean
  style: object
}

export default function SimpleAccordion(props: AccordionProps) {
  return (
    <div>
      <Accordion
        disabled={props.disabled}
        style={{
          ...props.style,
          border: 'none',
          borderBottom: '1px solid #C7C7C7',
          boxShadow: 'none',
          borderRadius: '0px',
        }}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
          style={{ padding: '0px' }}
        >
          <Typography>{props.title}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>{props.content}</Typography>
        </AccordionDetails>
      </Accordion>
    </div>
  )
}
