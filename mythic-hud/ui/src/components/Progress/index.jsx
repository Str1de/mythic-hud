import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Fade } from '@mui/material';
import { makeStyles } from '@mui/styles';
import useInterval from 'react-useinterval';

import Nui from '../../util/Nui';

const useStyles = makeStyles((theme) => ({
    wrapper: {
        width: '100%',
        maxWidth: 400,
        height: 'fit-content',
        position: 'absolute',
        bottom: '10%',
        left: 0,
        right: 0,
        margin: 'auto',
        fontFamily: "'Oswald', sans-serif",
    },
    labelRow: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    label: {
        fontSize: 18,
        fontWeight: 400,
        color: 'rgba(255,255,255,0.95)',
        letterSpacing: '0.03em',
        textShadow: '0 1px 4px rgba(0,0,0,1), 0 0 12px rgba(0,0,0,0.9), 0 0 2px rgba(0,0,0,1)',
    },
    labelFinished: {
        color: '#208692',
        textShadow: '0 0 10px rgba(32,134,146,0.5), 0 1px 4px rgba(0,0,0,1), 0 0 2px rgba(0,0,0,1)',
    },
    labelFailed: {
        color: '#c44040',
        textShadow: '0 0 10px rgba(196,64,64,0.4), 0 1px 4px rgba(0,0,0,1), 0 0 2px rgba(0,0,0,1)',
    },
    time: {
        fontSize: 15,
        fontWeight: 400,
        color: 'rgba(255,255,255,0.95)',
        letterSpacing: '0.04em',
        textShadow: '0 1px 4px rgba(0,0,0,1), 0 0 8px rgba(0,0,0,0.8), 0 0 2px rgba(0,0,0,1)',
    },
    trackOuter: {
        width: '100%',
        height: 6,
        background: 'rgba(255,255,255,0.08)',
        position: 'relative',
        overflow: 'hidden',
    },
    trackFill: {
        height: '100%',
        background: '#208692',
        transition: 'width 0.15s ease-out',
        position: 'relative',
        '&::after': {
            content: '""',
            position: 'absolute',
            right: 0,
            top: 0,
            bottom: 0,
            width: 20,
            background: 'linear-gradient(90deg, transparent, rgba(32,134,146,0.6))',
        },
    },
    trackFillFinished: {
        background: '#208692',
        '&::after': { display: 'none' },
    },
    trackFillFailed: {
        background: '#c44040',
        '&::after': { display: 'none' },
    },
    trackFillCancelled: {
        background: '#c44040',
        '&::after': { display: 'none' },
    },
}));

const mapStateToProps = (state) => ({
    showing: state.progress.showing,
    failed: state.progress.failed,
    cancelled: state.progress.cancelled,
    finished: state.progress.finished,
    label: state.progress.label,
    duration: state.progress.duration,
    startTime: state.progress.startTime,
});

export default connect(mapStateToProps)(
    ({ cancelled, finished, failed, label, duration, startTime, dispatch }) => {
        const classes = useStyles();

        const [curr, setCurr] = useState(0);
        const [fin, setFin] = useState(true);
        const [to, setTo] = useState(null);

        useEffect(() => {
            setCurr(0);
            setFin(true);
            if (to) {
                clearTimeout(to);
            }
        }, [startTime]);

        useEffect(() => {
            return () => {
                if (to) clearTimeout(to);
            };
        }, []);

        useEffect(() => {
            return () => {
                if (to) clearTimeout(to);
            };
        }, []);

        useEffect(() => {
            if (cancelled || finished || failed) {
                setCurr(0);
                setTo(
                    setTimeout(() => {
                        setFin(false);
                    }, 2000),
                );
            }
        }, [cancelled, finished, failed]);

        const tick = () => {
            if (failed || finished || cancelled) return;

            if (curr + 10 > duration) {
                dispatch({
                    type: 'FINISH_PROGRESS',
                });
            } else {
                setCurr(curr + 10);
            }
        };

        const hide = () => {
            dispatch({
                type: 'HIDE_PROGRESS',
            });
        };

        const pct = duration > 0 ? (curr / duration) * 100 : 0;

        const getLabelText = () => {
            if (finished) return 'Finished';
            if (failed) return 'Failed';
            if (cancelled) return 'Cancelled';
            return label;
        };

        const getLabelClass = () => {
            if (finished) return `${classes.label} ${classes.labelFinished}`;
            if (failed || cancelled) return `${classes.label} ${classes.labelFailed}`;
            return classes.label;
        };

        const getFillClass = () => {
            if (finished) return `${classes.trackFill} ${classes.trackFillFinished}`;
            if (failed) return `${classes.trackFill} ${classes.trackFillFailed}`;
            if (cancelled) return `${classes.trackFill} ${classes.trackFillCancelled}`;
            return classes.trackFill;
        };

        useInterval(tick, curr > duration ? null : 10);

        return (
            <Fade in={fin} timeout={1000} onExited={hide}>
                <div className={classes.wrapper}>
                    <div className={classes.labelRow}>
                        <span className={getLabelClass()}>
                            {getLabelText()}
                        </span>
                        {!cancelled && !finished && !failed && (
                            <span className={classes.time}>
                                {Math.round(curr / 1000)}s / {Math.round(duration / 1000)}s
                            </span>
                        )}
                    </div>
                    <div className={classes.trackOuter}>
                        <div
                            className={getFillClass()}
                            style={{
                                width: `${
                                    cancelled || finished || failed
                                        ? 100
                                        : pct
                                }%`,
                            }}
                        />
                    </div>
                </div>
            </Fade>
        );
    },
);
