import React, { Fragment } from 'react';
import { useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Fade } from '@mui/material';
import { makeStyles } from '@mui/styles';
import useKeypress from 'react-use-keypress';
import Nui from '../../util/Nui';

const useStyles = makeStyles((theme) => ({
    wrapper: {
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        pointerEvents: 'none',
        zIndex: 1000,
    },
    iconContainer: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
    },
    dot: {
        width: 6,
        height: 6,
        background: 'rgba(32,134,146,0.6)',
        border: '1px solid rgba(32,134,146,0.2)',
        borderRadius: '50%',
        transition: 'all 0.3s ease',
        boxShadow: '0 0 8px rgba(32,134,146,0.6)',
    },
    icon: {
        fontSize: '0.9rem',
        color: '#208692',
        padding: '6px',
        width: 24,
        height: 24,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(32,134,146,0.2)',
        border: '2px solid #208692',
        borderRadius: '50%',
        transition: 'all 0.3s ease',
        boxShadow: '0 0 15px rgba(32,134,146,0.2)',
    },
    menuList: {
        display: 'flex',
        flexDirection: 'column',
        gap: 6,
        marginTop: 15,
        pointerEvents: 'auto',
        minWidth: 180,
    },
    menuItem: {
        display: 'flex',
        alignItems: 'center',
        padding: '8px 14px',
        background: 'rgba(16, 16, 16, 0.95)',
        border: '1px solid rgba(32,134,146,0.2)',
        borderRadius: 3,
        color: '#ffffff',
        fontSize: 13,
        fontFamily: '"Oswald", sans-serif',
        fontWeight: 400,
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        userSelect: 'none',
        position: 'relative',
        overflow: 'hidden',
        height: 32,
        '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(135deg, rgba(32,134,146,0.1) 0%, rgba(32,134,146,0.5) 100%)',
            opacity: 0,
            transition: 'opacity 0.2s ease',
        },
        '&:hover': {
            borderColor: '#208692',
            transform: 'translateX(-2px)',
            boxShadow: '0 0 10px rgba(32,134,146,0.2)',
            '&::before': {
                opacity: 1,
            },
        },
    },
    menuIcon: {
        color: '#208692',
        fontSize: 12,
        marginRight: 10,
        minWidth: 14,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        zIndex: 1,
    },
    menuText: {
        flex: 1,
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        position: 'relative',
        zIndex: 1,
        lineHeight: '16px',
    },
}));

export default () => {
    const classes = useStyles();
    const showing = useSelector((state) => state.thirdEye.showing);
    const icon = useSelector((state) => state.thirdEye.icon);
    const menuOpen = useSelector((state) => state.thirdEye.menuOpen);
    const menu = useSelector((state) => state.thirdEye.menu);

    const menuButtonClick = (e, event, data) => {
        e.preventDefault();
        e.stopPropagation();
        Nui.send('targetingAction', {
            event,
            data,
        });
    };

    const closeMenu = () => {
        Nui.send('targetingAction', false);
    };

    useKeypress(['Escape', 'Backspace'], () => {
        if (!showing) return;
        closeMenu();
    });

    return (
        <Fragment>
            <Fade in={showing} timeout={300}>
                <div className={classes.wrapper}>
                    <div className={classes.iconContainer}>
                        {icon ? (
                            <div className={classes.icon}>
                                <FontAwesomeIcon icon={icon} />
                            </div>
                        ) : (
                            <div className={classes.dot} />
                        )}
                    </div>
                    
                    <Fade in={menuOpen && menu && menu.length > 0} timeout={200}>
                        <div className={classes.menuList}>
                            {menu && menu.map((item, index) => (
                                <div
                                    key={index}
                                    className={classes.menuItem}
                                    onClick={(e) => menuButtonClick(e, item.event, item.data)}
                                >
                                    {item.icon && (
                                        <div className={classes.menuIcon}>
                                            <FontAwesomeIcon icon={item.icon} />
                                        </div>
                                    )}
                                    <span className={classes.menuText}>
                                        {item.text}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </Fade>
                </div>
            </Fade>
        </Fragment>
    );
};