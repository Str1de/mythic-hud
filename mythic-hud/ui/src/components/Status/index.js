import React from 'react';
import { useSelector } from 'react-redux';
import { useTheme } from '@mui/material';
import { makeStyles, withTheme } from '@mui/styles';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

const useStyles = makeStyles((theme) => ({
    leftDiv: {
        position: 'absolute',
        top: '5vh',
        left: '0vh',
        width: '50%',
        height: '90%',

    },
    rightDiv: {
        position: 'absolute',
        top: '5vh',
        right: '0vh',
        width: '50%',
        height: '90%',

    },
    barsWrapper: {
        left: '3vh',
        width: 'auto',
        bottom: '-2vh',
        height: 'auto',
        position: 'absolute',
    },
    // relative so statWrapper's absolute left is measured from here
    wasteWrapper: {
        position: 'relative',
    },

    // ── VITAL BARS ────────────────────────────────────────────────────────────
    vitalStack: {
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5vh',
    },
    vitalRow: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: '1.5vh',
        padding: '0.5vh 0.75vh',
    },
    vitalIcon: {
        fontSize: '1.5vh',
        width: '2vh',
        textAlign: 'center',
        flexShrink: 0,
    },
    barTrack: {
        height: '0.75vh',
        width: '16vh',
        borderRadius: '1vh',
        boxShadow: 'inset 0 0 0.75vh rgba(0,0,0,0.7)',
        filter: 'drop-shadow(0 0 0.5vh rgba(0,0,0,0.6))',
        backgroundColor: 'rgba(255,255,255,0.06)',
        overflow: 'hidden',
        transition: 'all 0.4s ease',
    },
    barFill: {
        height: '100%',
        borderRadius: '1vh',
        transition: 'width 0.3s ease, background-color 1s ease, filter 1s ease',
    },

    // ── ARMOR SEGMENTS ────────────────────────────────────────────────────────
    armorTrack: {
        position: 'relative',
        height: '0.75vh',
        width: '16vh',
        filter: 'drop-shadow(0 0 0.5vh rgba(0,0,0,0.6))',
        flexShrink: 0,
    },
    armorSegmentsBase: {
        position: 'absolute',
        top: 0, left: 0,
        width: '100%', height: '100%',
        display: 'grid',
        gridTemplateColumns: 'repeat(5, 1fr)',
        gap: '0.3vh',
    },
    armorSegmentBase: {
        borderRadius: '1vh',
        backgroundColor: 'rgba(255,255,255,0.06)',
        boxShadow: 'inset 0 0 0.75vh rgba(0,0,0,0.7)',
    },
    armorSegmentsActive: {
        position: 'absolute',
        top: 0, left: 0,
        height: '100%',
        overflow: 'hidden',
        transition: 'width 0.3s ease',
    },
    armorSegmentsInner: {
        width: '16vh',
        height: '100%',
        display: 'grid',
        gridTemplateColumns: 'repeat(5, 1fr)',
        gap: '0.3vh',
    },
    armorSegmentActive: {
        borderRadius: '1vh',
        transition: 'background-color 1s ease, box-shadow 1s ease',
    },

    // ── FLASH ─────────────────────────────────────────────────────────────────
    '@keyframes flash': {
        '0%':   { opacity: 1 },
        '50%':  { opacity: 0.15 },
        '100%': { opacity: 1 },
    },
    flash: {
        animation: '$flash linear 1s infinite',
    },

    // ── ORIGINAL STATUS BARS ──────────────────────────────────────────────────
    statWrapper: {
        position: 'absolute',
        top: '50%',
        left: '22.5vh',
        width: '17vh',
        height: 'auto',
        transform: 'translateY(-50%)',
        display: 'grid',
        gridTemplateColumns: 'repeat(4, auto)',
        gap: '0.5vh',
    },
    stat: {
        position: 'relative',
        height: '3vh',
    },
    statBarBase: {
        position: 'absolute',
        width: '0.4vh',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
    },
    statBar: {
        position: 'absolute',
        bottom: '0vh',
        width: '100%',
        transition: 'height 0.2s ease',
        borderRadius: '1vh',
    },
    barIcon: {
        position: 'absolute',
        fontSize: '2vh',
        right: '0vh',
        width: '3.2vh',
        top: '0.5vh',
        textAlign: 'center',
    },
    boostBar: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        bottom: '0vh',
        left: '0vh',
        zIndex: 10,
        overflow: 'hidden',
    },
    boostBarFill: {
        position: 'absolute',
        bottom: '0vh',
        left: '0vh',
        width: '100%',
        transition: 'height 0.2s ease',
        background: 'linear-gradient(to top, #FFD700, #FFA500)',
        boxShadow: '0 0 0.5vh #FFD700',
    },

    talkingIcon: {
        position: 'absolute',
        bottom: '12vh',
        right: '5vh',
        fontSize: '3vh',
        color: 'yellowgreen',
        textShadow: '0 0 2px yellowgreen',
    },
}));

export default withTheme(() => {
    const classes = useStyles();
    const theme = useTheme();

    const config = useSelector((state) => state.hud.config);
    const inVeh = useSelector((state) => state.vehicle.showing);
    const isDead = useSelector((state) => state.status.isDead);
    const health = useSelector((state) => state.status.health);
    const armor = useSelector((state) => state.status.armor);
    const statuses = useSelector((state) => state.status.statuses);
    const isOnPhone = useSelector((state) => state.status.isOnPhone || false);
    const isOnRadio = useSelector((state) => state.status.isOnRadio || false);

    const getHealthColor = () => {
        if (isDead || health === 0) return '#ffffff';
        if (health <= 20) return '#ff4444';
        if (health <= 50) return '#ffaa33';
        return '#2de0b0';
    };

    const GetHealth = () => {
        const low = health <= 20 || isDead;
        const color = getHealthColor();
        return (
            <div className={classes.vitalRow}>
                <FontAwesomeIcon
                    icon={isDead ? 'skull-crossbones' : 'heart'}
                    className={`${classes.vitalIcon}${low ? ` ${classes.flash}` : ''}`}
                    style={{
                        color,
                        filter: `drop-shadow(0 0 0.15vh #000) drop-shadow(0 0 0.15vh #000) drop-shadow(0 0 0.3vh ${color})`,
                    }}
                />
                <div className={classes.barTrack}>
                    <div
                        className={`${classes.barFill}${low ? ` ${classes.flash}` : ''}`}
                        style={{
                            width: `${isDead ? 0 : health}%`,
                            backgroundColor: color,
                            filter: `drop-shadow(0 0 0.3vh ${color})`,
                        }}
                    />
                </div>
            </div>
        );
    };

    const GetArmor = () => {
        if (armor <= 0 || isDead) return null;
        const low = armor <= 20;
        const color = low ? '#4db8c4' : '#208692';
        return (
            <div className={classes.vitalRow}>
                <FontAwesomeIcon
                    icon={armor > 50 ? 'shield' : 'shield-halved'}
                    className={`${classes.vitalIcon}${low ? ` ${classes.flash}` : ''}`}
                    style={{
                        color,
                        filter: `drop-shadow(0 0 0.15vh #000) drop-shadow(0 0 0.15vh #000) drop-shadow(0 0 0.3vh ${color})`,
                    }}
                />
                <div className={classes.armorTrack}>
                    <div className={classes.armorSegmentsBase}>
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className={classes.armorSegmentBase} />
                        ))}
                    </div>
                    <div
                        className={`${classes.armorSegmentsActive}${low ? ` ${classes.flash}` : ''}`}
                        style={{ width: `${armor}%` }}
                    >
                        <div className={classes.armorSegmentsInner}>
                            {[...Array(5)].map((_, i) => (
                                <div
                                    key={i}
                                    className={classes.armorSegmentActive}
                                    style={{
                                        backgroundColor: color,
                                        boxShadow: `0 0 0.35vh ${color}`,
                                    }}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const statusElements = statuses
        .sort((a, b) => a.options.id - b.options.id)
        .map((status, i) => {
            if (
                (status.value >= 90 && status?.options?.hideHigh) ||
                (status.value == 0 && status?.options?.hideZero) ||
                (isDead && !status?.options?.visibleWhileDead)
            )
                return null;

            const hasBoost = status?.options?.progressModifier !== undefined;
            const boostValue = status?.options?.progressModifier || 0;

            return (
                <div key={i} className={classes.stat}>
                    <div className={classes.statBarBase}>
                        <div
                            className={classes.statBar}
                            style={{
                                height: `${status.value}%`,
                                backgroundColor: status.color || 'rgb(139, 91, 252)',
                                boxShadow: `0 0 0.5vh ${status.color || 'rgb(139, 91, 252)'}`,
                            }}
                        />
                    </div>
                    {hasBoost && (
                        <div className={classes.boostBar}>
                            <div
                                className={classes.boostBarFill}
                                style={{ height: `${boostValue}%` }}
                            />
                        </div>
                    )}
                    <FontAwesomeIcon
                        icon={status.icon || 'question'}
                        className={classes.barIcon}
                    />
                </div>
            );
        })
        .filter(Boolean);

    return (
        <>
            <div className={classes.leftDiv}>
                <div className={classes.barsWrapper}>
                    <div className={classes.wasteWrapper}>
                        <div className={classes.vitalStack}>
                            {GetArmor()}
                            {GetHealth()}
                        </div>
                        <div className={classes.statWrapper}>
                            {statusElements}
                        </div>
                    </div>
                </div>
            </div>

            {isOnPhone && (
                <FontAwesomeIcon icon="phone" className={classes.talkingIcon} />
            )}
            {isOnRadio && !isOnPhone && (
                <FontAwesomeIcon
                    icon="walkie-talkie"
                    className={classes.talkingIcon}
                />
            )}
        </>
    );
});
