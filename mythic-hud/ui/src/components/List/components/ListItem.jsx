import React from 'react';
import { makeStyles } from '@mui/styles';
import { useDispatch } from 'react-redux';

import Nui from '../../../util/Nui';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Sanitize } from '../../../util/Parser';

const useStyles = makeStyles((theme) => ({
    item: {
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        padding: '14px 20px',
        borderBottom: '1px solid rgba(32,134,146,0.08)',
        cursor: 'default',
        userSelect: 'none',
        transition: 'background 0.2s ease',
        fontFamily: "'Oswald', sans-serif",
        '&:first-of-type': {
            borderTop: '1px solid rgba(32,134,146,0.08)',
        },
        '&.clickable': {
            cursor: 'pointer',
            '&:hover': {
                background: 'rgba(32,134,146,0.06)',
            },
            '&:hover $accentBar': {
                opacity: 1,
            },
            '&:hover $iconWrap': {
                background: 'rgba(32,134,146,0.18)',
                borderColor: 'rgba(32,134,146,0.5)',
                color: '#208692',
            },
            '&:hover $label': {
                color: '#ffffff',
            },
            '&:hover $chevron': {
                color: '#208692',
                transform: 'translateX(2px)',
            },
        },
        '&.disabled': {
            opacity: 0.35,
            cursor: 'not-allowed',
            pointerEvents: 'none',
        },
    },
    accentBar: {
        position: 'absolute',
        left: 0,
        top: 0,
        bottom: 0,
        width: 3,
        background: '#208692',
        boxShadow: '0 0 8px rgba(32,134,146,0.5)',
        opacity: 0,
        transition: 'opacity 0.2s ease',
    },
    iconWrap: {
        width: 36,
        height: 36,
        borderRadius: 2,
        background: 'rgba(32,134,146,0.08)',
        border: '1px solid rgba(32,134,146,0.15)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'rgba(32,134,146,0.5)',
        fontSize: 13,
        flexShrink: 0,
        transition: 'all 0.2s ease',
    },
    content: {
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        minWidth: 0,
    },
    label: {
        fontSize: 14,
        fontWeight: 400,
        color: 'rgba(255,255,255,0.85)',
        letterSpacing: '0.03em',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        transition: 'color 0.2s ease',
    },
    description: {
        fontSize: 11,
        fontFamily: "'Oswald', sans-serif",
        color: 'rgba(255,255,255,0.35)',
        letterSpacing: '0.02em',
        marginTop: 2,
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        lineHeight: 1.3,
        '& *': {
            fontSize: 'inherit',
            color: 'inherit',
        },
    },
    rightSection: {
        display: 'flex',
        alignItems: 'center',
        gap: 4,
        flexShrink: 0,
        marginLeft: 8,
    },
    actionBtn: {
        width: 30,
        height: 30,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(32,134,146,0.06)',
        border: '1px solid rgba(32,134,146,0.15)',
        borderRadius: 2,
        color: 'rgba(32,134,146,0.5)',
        fontSize: 11,
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        '&:hover': {
            background: 'rgba(32,134,146,0.18)',
            borderColor: 'rgba(32,134,146,0.5)',
            color: '#208692',
            boxShadow: '0 0 10px rgba(32,134,146,0.2)',
        },
    },
    chevron: {
        color: 'rgba(32,134,146,0.3)',
        fontSize: 11,
        flexShrink: 0,
        transition: 'color 0.2s ease, transform 0.2s ease',
    },
}));

export default ({ index, item }) => {
    const classes = useStyles();
    const dispatch = useDispatch();

    const isClickable =
        !Boolean(item.actions) &&
        (Boolean(item.event) || Boolean(item.submenu));

    const onClick = () => {
        if (!isClickable) return;
        if (item.submenu) {
            Nui.send('ListMenu:SubMenu', {
                submenu: item.submenu,
            });
            dispatch({
                type: 'CHANGE_MENU',
                payload: {
                    menu: item.submenu,
                },
            });
        } else if (item.event) {
            Nui.send('ListMenu:Clicked', {
                event: item.event,
                data: item.data,
            });
        }
    };

    const onAction = (event) => {
        Nui.send('ListMenu:Clicked', {
            event: event,
            data: item.data,
        });
    };

    const itemClass = `${classes.item}${isClickable ? ' clickable' : ''}${
        Boolean(item.disabled) ? ' disabled' : ''
    }`;

    return (
        <div className={itemClass} onClick={isClickable ? onClick : undefined}>
            <div className={classes.accentBar} />
            <div className={classes.iconWrap}>
                <FontAwesomeIcon
                    icon={
                        item.icon
                            ? ['fas', item.icon]
                            : item.submenu
                            ? ['fas', 'folder']
                            : ['fas', 'circle']
                    }
                />
            </div>
            <div className={classes.content}>
                <span className={classes.label}>{item.label}</span>
                {Boolean(item.description) && (
                    <span className={classes.description}>
                        {Sanitize(item.description)}
                    </span>
                )}
            </div>
            <div className={classes.rightSection}>
                {Boolean(item.submenu) ? (
                    <FontAwesomeIcon
                        icon={['fas', 'chevron-right']}
                        className={classes.chevron}
                    />
                ) : Boolean(item.actions) ? (
                    item.actions.map((action, k) => {
                        return (
                            <button
                                key={`${index}-action-${k}`}
                                className={classes.actionBtn}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onAction(action.event);
                                }}
                            >
                                <FontAwesomeIcon
                                    icon={['fas', action.icon]}
                                />
                            </button>
                        );
                    })
                ) : null}
            </div>
        </div>
    );
};
