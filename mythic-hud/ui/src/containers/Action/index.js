/* eslint-disable react/no-danger */
import React from 'react';
import { useSelector } from 'react-redux';
import ReactHtmlParser from 'react-html-parser';
import { Fade } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const useStyles = makeStyles((theme) => ({
    wrapper: {
        color: 'rgba(255,255,255,0.9)',
        fontFamily: "'Oswald', sans-serif",
        height: 'fit-content',
        position: 'absolute',
        bottom: '5%',
        right: 0,
        left: 0,
        margin: 'auto',
        width: 'fit-content',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        fontSize: 18,
        letterSpacing: '0.03em',
        textShadow: '0 1px 4px rgba(0,0,0,1), 0 0 12px rgba(0,0,0,0.9), 0 0 2px rgba(0,0,0,1)',
    },
    icon: {
        fontSize: 18,
        color: '#208692',
        filter: 'drop-shadow(0 0 8px rgba(32,134,146,0.6)) drop-shadow(0 1px 3px rgba(0,0,0,1)) drop-shadow(0 0 6px rgba(0,0,0,0.8))',
    },
    text: {
        display: 'inline',
    },
    highlight: {
        color: '#3aaaf9',
        fontWeight: 500,
    },
    '.highlight': {
        color: '#3aaaf9',
        fontWeight: 500,
    },
    highlightSplit: {
        color: '#ffffff',
        fontWeight: 500,
    },
    key: {
        padding: '3px 10px',
        color: '#ffffff',
        fontWeight: 600,
        fontSize: 16,
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        background: 'rgba(32,134,146,0.12)',
        border: '1px solid rgba(32,134,146,0.4)',
        borderRadius: 2,
        marginLeft: 5,
        marginRight: 5,
        textShadow: '0 0 8px rgba(32,134,146,0.5), 0 1px 3px rgba(0,0,0,1)',
        boxShadow: '0 2px 8px rgba(0,0,0,0.6), 0 0 4px rgba(0,0,0,0.4)',
    },
}));

export default () => {
    const classes = useStyles();
    const showing = useSelector((state) => state.action.showing);
    const message = useSelector((state) => state.action.message);

    const ParseButtonText = () => {
        let v = message;
        v = v.replace(/\{key\}/g, `<span class=${classes.key}>`);
        v = v.replace(/\{\/key\}/g, `</span>`);
        return v;
    };

    if (!Boolean(message)) return null;
    return (
        <Fade in={showing} timeout={300}>
            <div className={classes.wrapper}>
                <FontAwesomeIcon
                    icon={['fas', 'circle-info']}
                    className={classes.icon}
                />
                <span className={classes.text}>
                    {ReactHtmlParser(ParseButtonText())}
                </span>
            </div>
        </Fade>
    );
};
