import React, { useEffect } from 'react';
import clsx from 'clsx';
import { createStyles, lighten, makeStyles, Theme } from '@material-ui/core/styles';
import {
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Toolbar,
  Typography,
  Paper,
  Checkbox,
  IconButton,
  Tooltip,
  Table,
} from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import { Add, Settings } from '@material-ui/icons';

interface Data {
  start: string;
  duration: string;
  end: string;
  description: string;
  id: string;
}

interface HeadCell {
  disablePadding: boolean;
  id: keyof Data;
  label: string;
  numeric: boolean;
}

interface EnhancedTableProps {
  classes: ReturnType<typeof useStyles>;
  numSelected: number;
  onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
  rowCount: number;
}

interface EnhancedTableToolbarProps {
  numSelected: number;
}

function createData(description: string, start: string, end: string, duration: string, id: string): Data {
  return { description, start, end, duration, id };
}

const useToolbarStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(1),
      marginTop: theme.spacing(2),
    },
    highlight:
      theme.palette.type === 'light'
        ? {
            color: theme.palette.secondary.main,
            backgroundColor: lighten(theme.palette.secondary.light, 0.85),
          }
        : {
            color: theme.palette.text.primary,
            backgroundColor: theme.palette.secondary.dark,
          },
    title: {
      flex: '1 1 100%',
    },
  }),
);

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
    },
    paper: {
      width: '100%',
      marginBottom: theme.spacing(2),
    },
    table: {
      minWidth: 750,
    },
    visuallyHidden: {
      border: 0,
      clip: 'rect(0 0 0 0)',
      height: 1,
      margin: -1,
      overflow: 'hidden',
      padding: 0,
      position: 'absolute',
      top: 20,
      width: 1,
    },
  }),
);

function timeDifference(date1: Date, date2: Date) {
  let difference = date1.getTime() - date2.getTime();
  const daysDifference = Math.floor(difference / 1000 / 60 / 60 / 24);
  difference -= daysDifference * 1000 * 60 * 60 * 24;
  const hoursDifference = Math.floor(difference / 1000 / 60 / 60);
  difference -= hoursDifference * 1000 * 60 * 60;
  const minutesDifference = Math.floor(difference / 1000 / 60);
  difference -= minutesDifference * 1000 * 60;
  const secondsDifference = Math.floor(difference / 1000);
  const stringHoursDifference = ('0' + hoursDifference).slice(-2);
  const stringMinutesDifference = ('0' + minutesDifference).slice(-2);
  const stringSecondsDifference = ('0' + secondsDifference).slice(-2);
  if (daysDifference === 0) return `${stringHoursDifference}:${stringMinutesDifference}:${stringSecondsDifference}`;
  return `${daysDifference} days, ${stringHoursDifference}:${stringMinutesDifference}:${stringSecondsDifference}`;
}

export default function TrackingsTable(props: any) {
  const classes = useStyles();
  const [selected, setSelected] = React.useState<string[]>([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const rows =
    props.trackings !== null
      ? props.trackings.map((track: any) => {
          let t = track.startTime.split(/[-T.:]/);
          const start = new Date(Date.UTC(t[0], t[1], t[2], t[3], t[4], t[5]));
          t = track.endTime.split(/[-:T.]/);
          const end = new Date(Date.UTC(t[0], t[1], t[2], t[3], t[4], t[5]));
          const duration = timeDifference(end, start);
          t = track.startTime.split(/[T .]/);
          const s = `${t[0]} ${t[1]}`;
          t = track.endTime.split(/[T .]/);
          const e = `${t[0]} ${t[1]}`;
          return createData(track.description, s, e, duration, track.id);
        })
      : [];
  const headCells: HeadCell[] = [
    { id: 'description', numeric: false, disablePadding: true, label: 'Description' },
    { id: 'start', numeric: false, disablePadding: false, label: 'Start' },
    { id: 'end', numeric: false, disablePadding: false, label: 'End' },
    { id: 'duration', numeric: false, disablePadding: false, label: 'Duration' },
  ];

  useEffect(() => {
    setSelected([]);
  }, [props]);
  const handleAdd = () => {
    const clickCallback = props.hasOwnProperty('add') ? props.add : null;
    if (typeof clickCallback === 'function') {
      clickCallback();
    }
  };
  const handleEdit = () => {
    const clickCallback = props.hasOwnProperty('edit') ? props.edit : null;
    if (typeof clickCallback === 'function') {
      props.selected(selected);
      clickCallback();
    }
  };
  const handleRemove = () => {
    const clickCallback = props.hasOwnProperty('remove') ? props.remove : null;
    if (typeof clickCallback === 'function') {
      props.selected(selected);
      clickCallback();
    }
  };
  const EnhancedTableToolbar = (props: EnhancedTableToolbarProps) => {
    const classes = useToolbarStyles();
    const { numSelected } = props;

    return (
      <Toolbar
        className={clsx(classes.root, {
          [classes.highlight]: numSelected > 0,
        })}
      >
        {numSelected > 0 ? (
          <Typography className={classes.title} color="inherit" variant="subtitle1" component="div">
            {numSelected} selected
          </Typography>
        ) : (
          <Typography className={classes.title} variant="h6" id="tableTitle" component="div">
            Trackings
          </Typography>
        )}
        {numSelected === 1 ? (
          <>
            <Tooltip title="Remove Tracking">
              <IconButton onClick={handleRemove} aria-label="delete">
                <DeleteIcon />
              </IconButton>
            </Tooltip>
            <Tooltip onClick={handleEdit} title="Edit Task">
              <IconButton aria-label="filter list">
                <Settings />
              </IconButton>
            </Tooltip>
          </>
        ) : numSelected !== 0 ? (
          <Tooltip title={'Remove Tracking'}>
            <IconButton onClick={handleRemove} aria-label="delete">
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        ) : (
          <Tooltip onClick={handleAdd} title={'Add Tracking'}>
            <IconButton aria-label="Add">
              <Add />
            </IconButton>
          </Tooltip>
        )}
      </Toolbar>
    );
  };
  const EnhancedTableHead = (props: EnhancedTableProps) => {
    const { onSelectAllClick, numSelected, rowCount } = props;
    return (
      <TableHead>
        <TableRow>
          <TableCell padding="checkbox">
            <Checkbox
              indeterminate={numSelected > 0 && numSelected < rowCount}
              checked={rowCount > 0 && numSelected === rowCount}
              onChange={onSelectAllClick}
              inputProps={{ 'aria-label': 'select all desserts' }}
            />
          </TableCell>
          {headCells.map((headCell) => (
            <TableCell
              key={headCell.id}
              align={headCell.numeric ? 'right' : 'left'}
              padding={headCell.disablePadding ? 'none' : 'default'}
            >
              {headCell.label}
            </TableCell>
          ))}
        </TableRow>
      </TableHead>
    );
  };

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelecteds = rows.map((n: any) => n.id);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event: React.MouseEvent<unknown>, id: string) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected: string[] = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const isSelected = (name: string) => selected.indexOf(name) !== -1;

  const emptyRows = rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <EnhancedTableToolbar numSelected={selected.length} />
        <TableContainer>
          <Table className={classes.table} aria-labelledby="tableTitle" size="medium" aria-label="enhanced table">
            <EnhancedTableHead
              classes={classes}
              numSelected={selected.length}
              onSelectAllClick={handleSelectAllClick}
              rowCount={rows.length}
            />
            <TableBody>
              {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row: any, index: number) => {
                const isItemSelected = isSelected(row.id);
                const labelId = `enhanced-table-checkbox-${index}`;
                return (
                  <TableRow
                    hover
                    onClick={(event: any) => handleClick(event, row.id)}
                    role="checkbox"
                    aria-checked={isItemSelected}
                    tabIndex={-1}
                    key={row.description + index}
                    selected={isItemSelected}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox checked={isItemSelected} inputProps={{ 'aria-labelledby': labelId }} />
                    </TableCell>
                    <TableCell component="th" id={labelId} scope="row" padding="none">
                      {row.description}
                    </TableCell>
                    <TableCell align="left">{row.start}</TableCell>
                    <TableCell align="left">{row.end}</TableCell>
                    <TableCell align="left">{row.duration}</TableCell>
                  </TableRow>
                );
              })}
              {emptyRows > 0 && (
                <TableRow style={{ height: 53 * emptyRows }}>
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
      </Paper>
    </div>
  );
}
