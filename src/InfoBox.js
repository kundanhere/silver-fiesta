import React from 'react';
import './InfoBox.css';
import { Card, CardContent, Typography } from '@material-ui/core';

function InfoBox({ title, cases, active, totalCases, ...props }) {
  return (
    <Card
      className={`infoBox ${active && 'infoBox--selected'}`}
      onClick={props.onClick}
    >
      <CardContent>
        <Typography className="infoBox__title" color="textSecondary">
          {title}
        </Typography>
        <h2 className="infoBox__cases">{cases}</h2>
        <Typography className="infoBox__totalCases" color="textSecondary">
          {totalCases} Total
        </Typography>
      </CardContent>
    </Card>
  );
}

export default InfoBox;
