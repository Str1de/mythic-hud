import React from 'react';
import { useSelector } from 'react-redux';
import { makeStyles } from '@mui/styles';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const directionRotation = {
    N: '0deg',
    NE: '45deg',
    E: '90deg',
    SE: '135deg',
    S: '180deg',
    SW: '225deg',
    W: '270deg',
    NW: '315deg',
};

const useStyles = makeStyles((theme) => ({
    wrapper: {
        position: 'absolute',
        top: 20,
        left: 0,
        right: 0,
        margin: 'auto',
        width: 'fit-content',
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        fontFamily: "'Oswald', sans-serif",
        animation: '$fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) both',
        pointerEvents: 'none',
    },
    compassIcon: {
        fontSize: 24,
        color: '#208692',
        filter: 'drop-shadow(0 0 10px rgba(32,134,146,0.8)) drop-shadow(0 1px 4px rgba(0,0,0,1)) drop-shadow(0 0 2px rgba(0,0,0,1))',
        transition: 'transform 0.3s ease',
    },
    directionText: {
        fontSize: 18,
        fontWeight: 600,
        letterSpacing: '0.15em',
        color: '#208692',
        marginLeft: 2,
        textShadow: '0 0 10px rgba(32,134,146,0.6), 0 1px 4px rgba(0,0,0,1), 0 0 2px rgba(0,0,0,1)',
    },
    divider: {
        width: 1,
        height: 26,
        background: 'rgba(32,134,146,0.4)',
        boxShadow: '0 0 6px rgba(0,0,0,0.8)',
    },
    streetGroup: {
        display: 'flex',
        flexDirection: 'column',
    },
    area: {
        fontSize: 12,
        fontWeight: 600,
        letterSpacing: '0.25em',
        textTransform: 'uppercase',
        color: 'rgba(32,134,146,0.8)',
        lineHeight: 1,
        marginBottom: 4,
        textShadow: '0 1px 3px rgba(0,0,0,1), 0 0 10px rgba(0,0,0,0.9), 0 0 2px rgba(0,0,0,1)',
    },
    streetRow: {
        display: 'flex',
        alignItems: 'center',
    },
    mainStreet: {
        fontSize: 18,
        fontWeight: 400,
        color: 'rgba(255,255,255,1)',
        letterSpacing: '0.03em',
        lineHeight: 1,
        textShadow: '0 1px 4px rgba(0,0,0,1), 0 0 12px rgba(0,0,0,0.9), 0 0 2px rgba(0,0,0,1)',
    },
    separator: {
        fontSize: 14,
        color: 'rgba(32,134,146,0.7)',
        margin: '0 10px',
        fontWeight: 300,
        textShadow: '0 1px 3px rgba(0,0,0,1), 0 0 2px rgba(0,0,0,1)',
    },
    crossStreet: {
        fontSize: 16,
        fontWeight: 400,
        color: 'rgba(255,255,255,0.65)',
        letterSpacing: '0.02em',
        lineHeight: 1,
        textShadow: '0 1px 4px rgba(0,0,0,1), 0 0 12px rgba(0,0,0,0.9), 0 0 2px rgba(0,0,0,1)',
    },
    '@keyframes fadeIn': {
        '0%': {
            opacity: 0,
            transform: 'translateY(-10px)',
        },
        '100%': {
            opacity: 1,
            transform: 'translateY(0)',
        },
    },
}));

export default () => {
    const classes = useStyles();
    const isShowing = useSelector((state) => state.location.showing);
    const location = useSelector((state) => state.location.location);
    const isBlindfolded = useSelector((state) => state.app.blindfolded);

    if (!isShowing || isBlindfolded) return null;

    const dir = location.direction || 'N';
    const rotation = directionRotation[dir] || '0deg';

    return (
        <div className={classes.wrapper}>
            <FontAwesomeIcon
                icon={['fas', 'location-arrow']}
                className={classes.compassIcon}
                style={{ transform: `rotate(${rotation})` }}
            />
            <span className={classes.directionText}>{dir}</span>
            <div className={classes.divider} />
            <div className={classes.streetGroup}>
                <span className={classes.area}>{location.area}</span>
                <div className={classes.streetRow}>
                    <span className={classes.mainStreet}>
                        {location.main}
                    </span>
                    {location.cross !== '' && (
                        <>
                            <span className={classes.separator}>×</span>
                            <span className={classes.crossStreet}>
                                {location.cross}
                            </span>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};
