import React, { useState, useEffect } from 'react';
import { makeStyles } from '@mui/styles';
import { Slide } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Moment from 'react-moment';
import useInterval from 'react-useinterval';

import { Sanitize } from '../../../util/Parser';
import { useDispatch } from 'react-redux';

const typeColors = {
    success: { accent: '#208692', accentDim: 'rgba(32,134,146,0.4)' },
    info: { accent: '#208692', accentDim: 'rgba(32,134,146,0.4)' },
    warning: { accent: '#d4993d', accentDim: 'rgba(212,153,61,0.4)' },
    error: { accent: '#c44040', accentDim: 'rgba(196,64,64,0.4)' },
};

const getColors = (type) => typeColors[type] || typeColors.info;

const useStyles = makeStyles((theme) => ({
    alert: {
        position: 'relative',
        background: 'rgba(18, 16, 37, 0.94)',
        border: '1px solid rgba(32,134,146,0.15)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.4), 0 0 0 1px rgba(32,134,146,0.04)',
        overflow: 'hidden',
        fontFamily: "'Oswald', sans-serif",
    },
    accentBar: {
        position: 'absolute',
        left: 0,
        top: 0,
        bottom: 0,
        width: 3,
    },
    content: {
        display: 'flex',
        alignItems: 'flex-start',
        gap: 12,
        padding: '12px 14px 12px 16px',
    },
    iconWrap: {
        width: 32,
        height: 32,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        fontSize: 14,
        marginTop: 1,
    },
    textGroup: {
        flex: 1,
        minWidth: 0,
    },
    topRow: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 4,
    },
    typeLabel: {
        fontSize: 9,
        fontWeight: 600,
        letterSpacing: '0.25em',
        textTransform: 'uppercase',
    },
    pinIcon: {
        fontSize: 9,
        marginRight: 6,
        opacity: 0.6,
    },
    timestamp: {
        fontSize: 10,
        color: 'rgba(255,255,255,0.25)',
        letterSpacing: '0.03em',
    },
    message: {
        fontSize: 13,
        fontWeight: 400,
        color: 'rgba(255,255,255,0.75)',
        letterSpacing: '0.02em',
        lineHeight: 1.4,
        '& b, & strong': {
            color: '#208692',
            fontWeight: 600,
        },
    },
    progressBar: {
        height: 2,
        width: '100%',
    },
    progressTrack: {
        height: '100%',
        transition: 'width ease-in 0.15s',
    },
}));

export default ({ notification }) => {
    const classes = useStyles();
    const dispatch = useDispatch();

    const [fin, setFin] = useState(false);
    const [timer, setTimer] = useState(0);

    const colors = getColors(notification.type);

    const getTypeIcon = () => {
        switch (notification.type) {
            case 'success':
                return ['fas', 'circle-check'];
            case 'warning':
                return ['fas', 'triangle-exclamation'];
            case 'error':
                return ['fas', 'circle-xmark'];
            default:
                return ['fas', 'circle-info'];
        }
    };

    const getTypeLabel = () => {
        switch (notification.type) {
            case 'success':
                return 'Success';
            case 'warning':
                return 'Warning';
            case 'error':
                return 'Error';
            default:
                return 'Info';
        }
    };

    useEffect(() => {
        setFin(true);
    }, []);

    useEffect(() => {
        if (notification.duration > 0 && timer >= notification.duration) {
            setTimeout(() => {
                setFin(false);
            }, 250);
        }
    }, [timer]);

    useEffect(() => {
        if (notification.hide) {
            setFin(false);
        }
    }, [notification]);

    const onHide = () => {
        dispatch({
            type: 'REMOVE_ALERT',
            payload: {
                id: notification._id,
            },
        });
    };

    const onTick = () => {
        setTimer(timer + 100);
    };

    useInterval(
        onTick,
        notification < 0 || timer >= notification.duration ? null : 100,
    );

    const progress =
        notification.duration > 0
            ? 100 - (timer / notification.duration) * 100
            : 0;

    return (
        <Slide direction="left" in={fin} onExited={onHide}>
            <div
                className={classes.alert}
                style={
                    Boolean(notification?.style?.alert)
                        ? { ...notification?.style?.alert }
                        : { borderColor: `${colors.accentDim}` }
                }
            >
                <div
                    className={classes.accentBar}
                    style={{ background: colors.accent }}
                />
                <div className={classes.content}>
                    <div
                        className={classes.iconWrap}
                        style={{ color: colors.accent }}
                    >
                        {notification.duration <= 0 && (
                            <FontAwesomeIcon
                                className={classes.pinIcon}
                                icon="thumbtack"
                                style={{ color: colors.accent }}
                            />
                        )}
                        <FontAwesomeIcon
                            icon={
                                Boolean(notification.icon)
                                    ? notification.icon
                                    : getTypeIcon()
                            }
                        />
                    </div>
                    <div className={classes.textGroup}>
                        <div className={classes.topRow}>
                            <span
                                className={classes.typeLabel}
                                style={{ color: colors.accent }}
                            >
                                {getTypeLabel()}
                            </span>
                            <Moment
                                className={classes.timestamp}
                                interval={60000}
                                fromNow
                                date={notification.created}
                            />
                        </div>
                        <div
                            className={classes.message}
                            style={
                                Boolean(notification?.style?.body)
                                    ? { ...notification?.style?.body }
                                    : null
                            }
                        >
                            {Sanitize(notification.message)}
                        </div>
                    </div>
                </div>
                {notification.duration > 0 && (
                    <div
                        className={classes.progressBar}
                        style={
                            Boolean(notification?.style?.progressBg)
                                ? { ...notification?.style?.progressBg }
                                : { background: 'rgba(255,255,255,0.05)' }
                        }
                    >
                        <div
                            className={classes.progressTrack}
                            style={
                                Boolean(notification?.style?.progress)
                                    ? {
                                          ...notification?.style?.progress,
                                          width: `${progress}%`,
                                      }
                                    : {
                                          width: `${progress}%`,
                                          background: colors.accent,
                                          opacity: 0.6,
                                      }
                            }
                        />
                    </div>
                )}
            </div>
        </Slide>
    );
};
