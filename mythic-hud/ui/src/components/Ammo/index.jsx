import React from 'react';
import { useSelector } from 'react-redux';
import { Fade } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const useStyles = makeStyles((theme) => ({
    wrapper: {
        position: 'absolute',
        bottom: '10.5vh',
        left: '27vh',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        fontFamily: "'Oswald', sans-serif",
        pointerEvents: 'none',
    },
    wrapperVehicle: {
        position: 'absolute',
        bottom: '11vh',
        left: '20vw',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        fontFamily: "'Oswald', sans-serif",
        pointerEvents: 'none',
    },
    icon: {
        fontSize: 18,
        color: '#208692',
        filter: 'drop-shadow(0 0 8px rgba(32,134,146,0.6)) drop-shadow(0 1px 3px rgba(0,0,0,1))',
    },
    ammoGroup: {
        display: 'flex',
        alignItems: 'baseline',
        gap: 0,
    },
    current: {
        fontSize: 28,
        fontWeight: 500,
        color: 'rgba(255,255,255,0.95)',
        letterSpacing: '0.02em',
        textShadow: '0 1px 4px rgba(0,0,0,1), 0 0 12px rgba(0,0,0,0.9), 0 0 2px rgba(0,0,0,1)',
        lineHeight: 1,
    },
    separator: {
        fontSize: 16,
        color: 'rgba(32,134,146,0.5)',
        margin: '0 5px',
        fontWeight: 300,
        textShadow: '0 1px 3px rgba(0,0,0,1)',
    },
    reserve: {
        fontSize: 16,
        fontWeight: 400,
        color: 'rgba(255,255,255,0.4)',
        letterSpacing: '0.02em',
        textShadow: '0 1px 4px rgba(0,0,0,1), 0 0 8px rgba(0,0,0,0.8), 0 0 2px rgba(0,0,0,1)',
        lineHeight: 1,
    },
    weaponLabel: {
        fontSize: 9,
        fontWeight: 600,
        letterSpacing: '0.2em',
        textTransform: 'uppercase',
        color: 'rgba(32,134,146,0.6)',
        textShadow: '0 1px 3px rgba(0,0,0,1), 0 0 6px rgba(0,0,0,0.8)',
        marginTop: 4,
    },
    rightBlock: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
    },
    lowAmmo: {
        color: '#c44040',
        textShadow: '0 0 10px rgba(196,64,64,0.4), 0 1px 4px rgba(0,0,0,1), 0 0 2px rgba(0,0,0,1)',
    },
}));

export default () => {
    const classes = useStyles();
    const showing = useSelector((state) => state.ammo.showing);
    const current = useSelector((state) => state.ammo.current);
    const reserve = useSelector((state) => state.ammo.reserve);
    const weaponLabel = useSelector((state) => state.ammo.weaponLabel);
    const isArmed = useSelector((state) => state.app.armed);
    const inVehicle = useSelector((state) => state.vehicle.showing);

    const isLow = current <= 5 && current > 0;
    const isEmpty = current === 0;

    return (
        <Fade in={showing && isArmed} timeout={300}>
            <div className={inVehicle ? classes.wrapperVehicle : classes.wrapper}>
                <FontAwesomeIcon
                    icon={['fas', 'gun']}
                    className={classes.icon}
                />
                <div className={classes.rightBlock}>
                    <div className={classes.ammoGroup}>
                        <span
                            className={`${classes.current}${
                                isEmpty ? ` ${classes.lowAmmo}` : isLow ? ` ${classes.lowAmmo}` : ''
                            }`}
                        >
                            {current}
                        </span>
                        <span className={classes.separator}>/</span>
                        <span className={classes.reserve}>{reserve}</span>
                    </div>

                </div>
            </div>
        </Fade>
    );
};
