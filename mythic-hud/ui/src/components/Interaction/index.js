import React, { useState } from 'react';
import { Fade, useTheme } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Nui from '../../util/Nui';
import useKeypress from 'react-use-keypress';
import { debounce } from 'lodash';

const RADIUS = 140;
const ITEM_SIZE = 56;

const useStyles = makeStyles((theme) => ({
    overlay: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        margin: 'auto',
        display: 'flex',
        width: '100vw',
        height: '100vh',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: "'Oswald', sans-serif",
    },
    ring: {
        position: 'relative',
        width: RADIUS * 2 + ITEM_SIZE,
        height: RADIUS * 2 + ITEM_SIZE,
    },
    item: {
        position: 'absolute',
        width: ITEM_SIZE,
        height: ITEM_SIZE,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '50%',
        background: 'rgba(18, 16, 37, 0.92)',
        border: '1px solid rgba(32,134,146,0.2)',
        color: 'rgba(255,255,255,0.7)',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        userSelect: 'none',
        boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
        '&:hover': {
            background: 'rgba(32,134,146,0.15)',
            borderColor: 'rgba(32,134,146,0.6)',
            color: '#208692',
            boxShadow:
                '0 4px 20px rgba(0,0,0,0.4), 0 0 20px rgba(32,134,146,0.2)',
            transform: 'scale(1.12)',
        },
    },
    itemIcon: {
        fontSize: 18,
        transition: 'color 0.2s ease',
    },
    label: {
        position: 'absolute',
        top: ITEM_SIZE + 6,
        left: '50%',
        transform: 'translateX(-50%)',
        fontSize: 10,
        fontWeight: 600,
        letterSpacing: '0.08em',
        color: 'rgba(255,255,255,0.5)',
        whiteSpace: 'nowrap',
        textShadow: '0 0 6px rgba(0,0,0,0.9)',
        pointerEvents: 'none',
        opacity: 0,
        transition: 'opacity 0.2s ease',
    },
    labelVisible: {
        opacity: 1,
    },
    centerBtn: {
        position: 'absolute',
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)',
        width: 44,
        height: 44,
        borderRadius: '50%',
        background: 'rgba(18, 16, 37, 0.92)',
        border: '1px solid rgba(32,134,146,0.25)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        color: 'rgba(32,134,146,0.6)',
        fontSize: 18,
        transition: 'all 0.2s ease',
        boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
        '&:hover': {
            borderColor: 'rgba(32,134,146,0.6)',
            color: '#208692',
            boxShadow:
                '0 4px 20px rgba(0,0,0,0.4), 0 0 16px rgba(32,134,146,0.15)',
        },
    },

}));

const Interaction = () => {
    const classes = useStyles();
    const showing = useSelector((state) => state.interaction.show);
    const menuItems = useSelector((state) => state.interaction.menuItems);
    const layer = useSelector((state) => state.interaction.layer);
    const [hovered, setHovered] = useState(null);

    useKeypress(['F1', 'Escape'], () => {
        if (!showing) return;
        else Nui.send('Interaction:Hide');
    });

    const trigger = debounce(function (item) {
        Nui.send('Interaction:Trigger', item);
    }, 0);

    const back = async () => {
        if (layer === 0) return await Nui.send('Interaction:Hide');
        await Nui.send('Interaction:Back');
    };

    const sortedItems = [...menuItems].sort((a, b) =>
        a.id < b.id ? -1 : a.id > b.id ? 1 : 0,
    );

    const count = sortedItems.length;
    const angleStep = (2 * Math.PI) / Math.max(count, 1);
    const startAngle = -Math.PI / 2;

    const center = RADIUS + ITEM_SIZE / 2;

    return (
        <Fade in={showing} timeout={300}>
            <div className={classes.overlay}>
                <div className={classes.ring}>
                    {sortedItems.map((item, i) => {
                        const angle = startAngle + angleStep * i;
                        const x =
                            center + RADIUS * Math.cos(angle) - ITEM_SIZE / 2;
                        const y =
                            center + RADIUS * Math.sin(angle) - ITEM_SIZE / 2;

                        return (
                            <React.Fragment key={item.id}>
                                <div
                                    className={classes.item}
                                    style={{ left: x, top: y }}
                                    onClick={() => trigger(item)}
                                    onMouseEnter={() => setHovered(item.id)}
                                    onMouseLeave={() => setHovered(null)}
                                >
                                    <FontAwesomeIcon
                                        icon={item.icon ?? 'question'}
                                        className={classes.itemIcon}
                                    />
                                    <span
                                        className={`${classes.label}${
                                            hovered === item.id
                                                ? ` ${classes.labelVisible}`
                                                : ''
                                        }`}
                                    >
                                        {item.label}
                                    </span>
                                </div>
                            </React.Fragment>
                        );
                    })}
                    <div className={classes.centerBtn} onClick={back}>
                        <FontAwesomeIcon
                            icon={
                                layer === 0
                                    ? 'xmark'
                                    : 'arrow-left'
                            }
                        />
                    </div>
                </div>
            </div>
        </Fade>
    );
};

export default Interaction;
