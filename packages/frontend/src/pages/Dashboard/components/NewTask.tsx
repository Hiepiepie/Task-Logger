import React, { ChangeEvent, useEffect, useState } from 'react';
import {
  TextField,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Dialog,
  createStyles,
  makeStyles,
  Theme,
  useTheme,
  useMediaQuery,
} from '@material-ui/core';
import axios from 'axios';
import InputTag from '../../../components/InputTag/InputTag';

const NewTask = (props: any) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [isMissing, setMissing] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [newLabels, setNewLabels] = useState([]);
  useEffect(() => {
    setOpen(true);
  }, [props]);

  const handleSave = (e: any) => {
    e.preventDefault();
    if (name.trim().length !== 0) {
      setMissing(false);
      setOpen(false);
      const toBeSavedLabels = newLabels
        ? newLabels.map((l: string) => {
            return { name: l };
          })
        : [];
      const time = new Date().toISOString();
      const task = { name, description, labels: toBeSavedLabels, createdAt: time, updatedAt: time };
      saveToDB(task).then(props.save());
    } else {
      setMissing(true);
    }
  };
  const saveToDB = async (task: any) => {
    await axios.post('/task', task).catch((e) => {
      alert(` Error code ${e.response.status} in saving task \n ${e.response.data.message}`);
    });
  };
  const handleCancel = () => {
    setOpen(false);
    props.open();
  };
  const handleChange = (tagsProp: any, e: any, type: string) => {
    switch (type) {
      case 'Name':
        e ? setName(e.target.value) : void(0);
        break;
      case 'Label':
        tagsProp ? setNewLabels(tagsProp) : void(0);
        break;
      case 'Description':
        e ? setDescription(e.target.value) : void(0);
        break;
      default:
        break;
    }
  };
  return (
    <Dialog
      fullScreen={fullScreen}
      open={open}
      onClose={handleCancel}
      aria-labelledby="responsive-dialog-title"
      disableBackdropClick
    >
      <DialogTitle id="responsive-dialog-title">{'Create a new Task'}</DialogTitle>
      <DialogContent className={classes.root}>
        <TextField
          error={isMissing}
          helperText={isMissing ? 'Enter a valid Name' : ''}
          required
          multiline
          label="Task Name"
          value={name}
          onChange={(e: ChangeEvent) => handleChange(null, e, 'Name')}
        />
        <InputTag handleChange={(tagsProp: any) => handleChange(tagsProp, null, 'Label')} />
        <TextField
          multiline
          id="standard-multiline-static"
          label="Description"
          value={description}
          rows={4}
          onChange={(e: ChangeEvent) => handleChange(null, e, 'Description')}
        />
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={handleCancel} color="primary">
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

export default NewTask;
