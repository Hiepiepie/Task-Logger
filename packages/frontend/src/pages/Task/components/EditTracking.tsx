import React, { ChangeEvent, useEffect, useState } from 'react';
import {
  TextField,
  DialogActions,
  Button,
  DialogContent,
  DialogTitle,
  Dialog,
  useMediaQuery,
  createStyles,
  makeStyles,
  Theme,
  useTheme,
} from '@material-ui/core';
import DateTimePicker from '../../../components/DateTimePicker';
import { labelEnd, labelStart } from './NewTracking';

const EditTracking = (props: any) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [description, setDescription] = useState('');
  const [start, setStart] = useState<string>('');
  const [end, setEnd] = useState<string>('');
  useEffect(() => {
    setOpen(true);
    setStart(props.tracking.startTime);
    setEnd(props.tracking.endTime);
    setDescription(props.tracking.description);
  }, [props]);
  const handleSave = () => {
    props.save({
      description: description ? description : '',
      startTime: start,
      endTime: end,
      updatedAt: new Date().toISOString(),
    });
  };
  const handleClose = () => {
    setOpen(false);
    props.cancel();
  };
  const handleChange = (e: any) => {
    setDescription(e.target.value);
  };

  const handleSelect = (dateProp: any, typeProp: string) => {
    if (dateProp && typeProp) {
      typeProp === 'Start Time' ? setStart(dateProp.toISOString()) : setEnd(dateProp.toISOString());
    }
  };
  return (
    <Dialog
      fullScreen={fullScreen}
      open={open}
      onClose={handleClose}
      aria-labelledby="responsive-dialog-title"
      disableBackdropClick
    >
      <DialogTitle id="responsive-dialog-title">{'Edit this Tracking'}</DialogTitle>
      <DialogContent className={classes.root}>
        <TextField
          multiline
          id="standard-multiline-static"
          label="Description"
          value={description}
          rows={4}
          onChange={(e: ChangeEvent) => handleChange(e)}
        />
        <DateTimePicker date={start} selectedDate={handleSelect} label={labelStart} />
        <DateTimePicker date={end} selectedDate={handleSelect} label={labelEnd} />
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={handleClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleSave} color="primary" autoFocus>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      flexWrap: 'wrap',
      flexDirection: 'column',
      margin: theme.spacing(1),
    },
  }),
);
export default EditTracking;
