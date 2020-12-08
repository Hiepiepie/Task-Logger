import 'date-fns';
import React, { useEffect } from 'react';
import DateFnsUtils from '@date-io/date-fns';
import { KeyboardDatePicker, KeyboardTimePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import { Typography, Grid } from '@material-ui/core';

const DateTimePicker = (props: any) => {
  // The first commit of Material-UI
  const [selectedDate, setSelectedDate] = React.useState<Date | null>(
    new Date(props.date ? props.date.split('.')[0] : '2020-01-01T00:00:00.000Z'),
  );
  useEffect(() => {
    if (!props.date) {
      const clone = new Date('2020-01-01T01:00:00.000Z');
      if (isValidDate(clone)) props.selectedDate(clone, props.label.type);
    }
  }, [props]);
  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date);
    const clone = new Date(date!.getTime());
    clone.setHours(clone.getHours() + 1);
    if (isValidDate(clone)) props.selectedDate(clone, props.label.type);
  };

  const isValidDate = (d: any) => {
    // @ts-ignore
    return d instanceof Date && !isNaN(d);
  };

  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <Typography variant={'subtitle2'} style={{ marginTop: '10px' }}>
        <em>{props.label.type}</em>
      </Typography>
      <Grid container justify="space-around">
        <KeyboardDatePicker
          disableToolbar
          variant="inline"
          format="MM/dd/yyyy"
          margin="normal"
          id={`date-picker-inline ${props.label.type}`}
          label={props.label.date}
          value={selectedDate}
          onChange={handleDateChange}
          KeyboardButtonProps={{
            'aria-label': 'change date',
          }}
        />
        <KeyboardTimePicker
          margin="normal"
          id={`time-picker ${props.label.type}`}
          label={props.label.time}
          value={selectedDate}
          onChange={handleDateChange}
          KeyboardButtonProps={{
            'aria-label': 'change time',
          }}
        />
      </Grid>
    </MuiPickersUtilsProvider>
  );
};
export default DateTimePicker;
