import React, { useEffect, useState } from 'react';
import { Task } from '../Task';
import TrackingsTable from './TrackingsTable';
import { Chip, createStyles, makeStyles, Theme } from '@material-ui/core';
import NewTracking from './NewTracking';
import EditTracking from './EditTracking';
import ConfirmationDialog from '../../../components/ConfirmationDialog';
import axios from 'axios';

const TaskDetails = (props: any) => {
  const [task, setTask] = useState<Task | null>(null);
  const [addActive, setAddActive] = useState(false);
  const [editActive, setEditActive] = useState(false);
  const [removeActive, setRemoveActive] = useState(false);
  const [selectedTrackings, setSelectedTrackings] = useState<any>([]);
  const classes = useStyles();

  useEffect(() => {
    setTask(props.task);
    setSelectedTrackings([]);
  }, [props]);

  const updateToDB = async (task: any) => {
    await axios.patch(`/task/${task.id}`, task).catch((e) => {
      alert(` Error code ${e.response.status} in update task \n ${e.response.data.message}`);
    });
  };

  const handleNewTracking = (trackingProp: any) => {
    if (trackingProp && task) {
      task.trackings.push({
        description: trackingProp.description,
        startTime: trackingProp.startTime,
        endTime: trackingProp.endTime,
      });
      updateToDB(task).then(() => props.save());
    }
    setAddActive(!addActive);
  };

  const handleEdit = (trackingProp: any) => {
    if (trackingProp) {
      task!.trackings.splice(
        task!.trackings.findIndex((track: any) => track.description === selectedTrackings[0].description),
        1,
        {
          description: trackingProp.description,
          startTime: trackingProp.startTime,
          endTime: trackingProp.endTime,
          updatedAt: trackingProp.updatedAt,
        },
      );
      updateToDB(task).then(() => props.save());
    }
    setEditActive(!editActive);
  };

  const handleRemove = () => {
    selectedTrackings.map((selectedTrack: any) => {
      task!.trackings.splice(
        task!.trackings.findIndex((track: any) => track.id === selectedTrack.id),
        1,
      );
      updateToDB(task)
        .then(() => removeTracking(selectedTrack))
        .then(() => props.save());
    });
    setRemoveActive(!removeActive);
  };
  const handleCancel = () => {
    setRemoveActive(false);
    setEditActive(false);
    setAddActive(false);
  };
  const removeTracking = async (tracking: any) => {
    await axios.delete(`/tracking/${tracking.id}`).catch((e) => {
      alert(` Error code ${e.response.status} in delete tracking \n ${e.response.data.message}`);
    });
  };
  const handleSelected = (selectedIds: string[]) => {
    const trackings: any = task?.trackings.filter((tracking: any) => {
      if (selectedIds.includes(tracking.id)) {
        return tracking;
      }
    });
    setSelectedTrackings(trackings);
  };
  if (task !== null) {
    return (
      <div>
        {task.labels
          ? task.labels.map((label: any, index: number) => {
              return (
                <Chip
                  className={classes.margin}
                  key={index}
                  style={{ backgroundColor: '#caffbf' }}
                  size="small"
                  label={label.name}
                />
              );
            })
          : null}
        <TrackingsTable
          trackings={task.trackings}
          selected={handleSelected}
          add={handleNewTracking}
          edit={handleEdit}
          remove={() => setRemoveActive(true)}
        />
        {addActive ? <NewTracking cancel={handleCancel} save={handleNewTracking} /> : null}
        {editActive ? <EditTracking cancel={handleCancel} tracking={selectedTrackings[0]} save={handleEdit} /> : null}
        {removeActive ? (
          <ConfirmationDialog title="Remove Task" okName={'Remove'} cancel={handleCancel} ok={handleRemove}>
            Are you sure ?
          </ConfirmationDialog>
        ) : null}
      </div>
    );
  }
  return null;
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    margin: {
      margin: theme.spacing(1),
    },
  }),
);

export default TaskDetails;
