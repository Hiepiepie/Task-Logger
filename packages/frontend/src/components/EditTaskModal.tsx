import React, { ChangeEvent, useEffect, useState } from 'react';
import {
  Dialog,
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  useMediaQuery,
  createStyles,
  makeStyles,
  Theme,
  useTheme,
  TextField,
} from '@material-ui/core';
import InputTag from './InputTag/InputTag';
import axios from 'axios';

const EditTaskModal = (props: any) => {
  const [open, setOpen] = useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const [name, setName] = useState('');
  const [labels, setLabels] = useState<string[]>(['']);
  const [description, setDescription] = useState('');
  const classes = useStyles();
  useEffect(() => {
    setName(props.task.name);
    setLabels(
      props.task.labels.map((label: any) => {
        return label.name;
      }),
    );
    setDescription(props.task.description !== null ? props.task.description : '');
    setOpen(true);
  }, [props]);
  const handleCancel = () => {
    setOpen(false);
    props.cancel();
  };
  const handleSave = (e: any) => {
    e.preventDefault();
    setOpen(false);
    const updatedAt = new Date().toISOString();
    const propLabels = labels.map((label: any) => {
      return { name: label };
    });
    const task = { name, labels: propLabels, description, updatedAt };
    saveToDB(task).then(() => props.save());
  };
  const saveToDB = async (task: any) => {
    await axios.patch(`/task/${props.task.id}`, task).catch((e) => {
      alert(` Error code ${e.response.status} in saving task \n ${e.response.data.message}`);
    });
  };
  const handleChange = (tagsProp: any, e: any, type: string) => {
    switch (type) {
      case 'Name':
        e ? setName(e.target.value) : void(0);
        break;
      case 'Label':
        tagsProp ? setLabels(tagsProp) : void(0);
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
      <DialogTitle id="responsive-dialog-title">{'Edit Task'}</DialogTitle>
      <DialogContent className={classes.root}>
        <TextField
          multiline
          label="Task Name"
          value={name}
          onChange={(e: ChangeEvent) => handleChange(null, e, 'Name')}
        />
        <InputTag tags={labels} handleChange={(tagsProp: ChangeEvent) => handleChange(tagsProp, null, 'Label')} />
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

export default EditTaskModal;
