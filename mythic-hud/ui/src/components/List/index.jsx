import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Slide } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import useKeypress from 'react-use-keypress';

import Nui from '../../util/Nui';
import ListItem from './components/ListItem';

const useStyles = makeStyles((theme) => ({
    wrapper: {
        width: '100%',
        maxWidth: 380,
        height: '100%',
        maxHeight: 'calc(100% - 200px)',
        position: 'absolute',
        top: 120,
        right: '4%',
        display: 'flex',
        flexDirection: 'column',
        background: 'rgba(18, 16, 37, 0.94)',
        border: '1px solid rgba(32,134,146,0.18)',
        boxShadow:
            '0 0 0 1px rgba(32,134,146,0.05), 0 24px 80px rgba(0,0,0,0.6), 0 0 40px rgba(32,134,146,0.04)',
        animation: '$panelSlide 0.4s cubic-bezier(0.16, 1, 0.3, 1) both',
        fontFamily: "'Oswald', sans-serif",
    },
    header: {
        padding: '16px 20px 14px',
        borderBottom: '1px solid rgba(32,134,146,0.15)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexShrink: 0,
    },
    titleGroup: {
        display: 'flex',
        flexDirection: 'column',
        minWidth: 0,
        flex: 1,
    },
    titleLabel: {
        fontSize: 9,
        fontWeight: 600,
        letterSpacing: '0.3em',
        textTransform: 'uppercase',
        color: 'rgba(32,134,146,0.7)',
        marginBottom: 2,
    },
    titleText: {
        fontFamily: "'Oswald', sans-serif",
        fontSize: 16,
        fontWeight: 500,
        color: '#ffffff',
        letterSpacing: '0.06em',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
    },
    headerActions: {
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        flexShrink: 0,
        marginLeft: 12,
    },
    breadcrumb: {
        display: 'flex',
        alignItems: 'center',
        gap: 4,
        marginRight: 6,
    },
    breadcrumbDot: {
        width: 5,
        height: 5,
        borderRadius: '50%',
        background: 'rgba(32,134,146,0.3)',
    },
    breadcrumbDotActive: {
        background: '#208692',
        boxShadow: '0 0 6px rgba(32,134,146,0.6)',
    },
    headerBtn: {
        width: 32,
        height: 32,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(32,134,146,0.08)',
        border: '1px solid rgba(32,134,146,0.2)',
        borderRadius: 2,
        color: 'rgba(32,134,146,0.6)',
        fontSize: 12,
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        '&:hover': {
            background: 'rgba(32,134,146,0.18)',
            borderColor: 'rgba(32,134,146,0.5)',
            color: '#208692',
        },
    },
    list: {
        flex: 1,
        padding: 0,
        margin: 0,
        listStyle: 'none',
        overflowY: 'auto',
        overflowX: 'hidden',
        '&::-webkit-scrollbar': {
            width: 4,
        },
        '&::-webkit-scrollbar-thumb': {
            background: 'rgba(32,134,146,0.3)',
            borderRadius: 2,
        },
        '&::-webkit-scrollbar-thumb:hover': {
            background: '#208692',
        },
        '&::-webkit-scrollbar-track': {
            background: 'transparent',
        },
    },
    empty: {
        padding: '40px 20px',
        textAlign: 'center',
        color: 'rgba(255,255,255,0.25)',
        fontSize: 13,
        letterSpacing: '0.08em',
    },
    '@keyframes panelSlide': {
        '0%': {
            opacity: 0,
            transform: 'translateX(40px)',
        },
        '100%': {
            opacity: 1,
            transform: 'translateX(0)',
        },
    },
}));

export default () => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const showing = useSelector((state) => state.list.showing);
    const active = useSelector((state) => state.list.active);
    const stack = useSelector((state) => state.list.stack);
    const menus = useSelector((state) => state.list.menus);

    const menu = menus[active];

    useKeypress(['Escape'], () => {
        if (!showing) return;
        else onClose();
    });

    const onBack = () => {
        Nui.send('ListMenu:Back');
        dispatch({
            type: 'LIST_GO_BACK',
        });
    };

    const onClose = () => {
        Nui.send('ListMenu:Close');
    };

    if (!showing || !Boolean(menu)) return null;

    const depth = Boolean(stack) ? stack.length : 0;

    return (
        <Slide direction="left" in={showing} timeout={350} mountOnEnter unmountOnExit>
            <div className={classes.wrapper}>
                <div className={classes.header}>
                    <div className={classes.titleGroup}>
                        <span className={classes.titleLabel}>Menu</span>
                        <span className={classes.titleText}>
                            {menu?.label ?? 'List'}
                        </span>
                    </div>
                    <div className={classes.headerActions}>
                        {depth > 0 && (
                            <div className={classes.breadcrumb}>
                                {Array.from({ length: depth + 1 }).map((_, i) => (
                                    <div
                                        key={i}
                                        className={`${classes.breadcrumbDot}${
                                            i === depth
                                                ? ` ${classes.breadcrumbDotActive}`
                                                : ''
                                        }`}
                                    />
                                ))}
                            </div>
                        )}
                        {depth > 0 && (
                            <button
                                className={classes.headerBtn}
                                onClick={onBack}
                            >
                                <FontAwesomeIcon
                                    icon={['fas', 'arrow-left']}
                                />
                            </button>
                        )}
                        <button
                            className={classes.headerBtn}
                            onClick={onClose}
                        >
                            <FontAwesomeIcon icon={['fas', 'xmark']} />
                        </button>
                    </div>
                </div>
                <div className={classes.list}>
                    {Boolean(menu) && menu.items.length > 0 ? (
                        menu.items.map((item, k) => {
                            return (
                                <ListItem
                                    key={`${active}-${k}`}
                                    index={k}
                                    item={item}
                                />
                            );
                        })
                    ) : (
                        <div className={classes.empty}>No items</div>
                    )}
                </div>
            </div>
        </Slide>
    );
};
