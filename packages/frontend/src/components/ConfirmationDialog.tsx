import React, { useEffect, useState } from 'react';
import {
  Button,
  useMediaQuery,
  DialogActions,
  DialogContent,
  DialogTitle,
  Dialog,
  createStyles,
  makeStyles,
  Theme,
  useTheme,
} from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      flexWrap: 'wrap',
      flexDirection: 'column',
      margin: theme.spacing(1),
      textAlign: 'center',
    },
  }),
);
const ConfirmationDialog = (props: any) => {
  const [open, setOpen] = useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const classes = useStyles();

  useEffect(() => {
    setOpen(true);
  }, [props]);

  const handleOk = () => {
    props.ok();
  };
  const handleCancel = () => {
    setOpen(false);
    props.cancel();
  };

  return (
    <div>
      <Dialog
        fullScreen={fullScreen}
        open={open}
        onClose={handleCancel}
        aria-labelledby="responsive-dialog-title"
        disableBackdropClick
      >
        <DialogTitle id="responsive-dialog-title">{props.title}</DialogTitle>
        <DialogContent className={classes.root}>{props.children}</DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleCancel} color="primary">
            Cancel
          </Button>
          <Button onClick={handleOk} color="primary" autoFocus>
            {props.okName ? props.okName : 'OK'}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ConfirmationDialog;
