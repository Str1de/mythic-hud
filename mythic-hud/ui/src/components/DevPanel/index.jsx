import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@mui/styles';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const isDev = process.env.NODE_ENV !== 'production';

const TEST_DATA = {
    notifications: {
        success: { icon: 'circle-check', message: 'Vehicle has been stored in your garage.', duration: 8000, type: 'success' },
        error:   { icon: 'circle-xmark', message: 'You do not have the required items.', duration: 6000, type: 'error' },
        warning: { icon: 'triangle-exclamation', message: 'You are running low on fuel.', duration: 10000, type: 'warning' },
        info:    { icon: 'circle-info', message: 'Press <b>E</b> to interact with the ATM.', duration: 12000, type: 'info' },
        persistent: { icon: 'thumbtack', message: 'Server restart in 30 minutes.', duration: -1, type: 'info' },
    },
    action: { message: '{key}Scroll Up{/key} Turn Engine On' },
    listMenu: {
        main: {
            label: 'Emotes',
            items: [
                { label: 'Emote Binds', description: 'Edit Your Emote Binds', event: 'Animations:Client:OpenEmoteBinds' },
                { label: 'Prop Emotes', description: 'Emotes', submenu: 'emotes-prop' },
                { label: 'Dance Emotes', description: 'Emotes', submenu: 'emotes-dance' },
                { label: 'Idles', description: 'Emotes', submenu: 'emotes-idles' },
                { label: 'Sitting', description: 'Emotes', submenu: 'emotes-sitting' },
                { label: 'Greetings & Interaction', description: 'Emotes', submenu: 'emotes-interactions' },
                { label: 'Reactions', description: 'Emotes', submenu: 'emotes-reactions' },
                { label: 'Celebration', description: 'Emotes', submenu: 'emotes-celebration' },
                { label: 'Fighting', description: 'Emotes', submenu: 'emotes-fighting' },
            ],
        },
        'emotes-prop':         { label: 'Prop Emotes',    items: [{ label: 'Beer', description: '/e beer', event: 'Emote', data: 'beer' }, { label: 'Camera', description: '/e camera', event: 'Emote', data: 'camera' }] },
        'emotes-dance':        { label: 'Dance Emotes',   items: [{ label: 'Dance', description: '/e dance', event: 'Emote', data: 'dance' }, { label: 'Salsa', description: '/e salsa', event: 'Emote', data: 'salsa' }] },
        'emotes-idles':        { label: 'Idles',          items: [{ label: 'Idle', description: '/e idle', event: 'Emote', data: 'idle' }] },
        'emotes-sitting':      { label: 'Sitting',        items: [{ label: 'Sit', description: '/e sit', event: 'Emote', data: 'sit' }] },
        'emotes-interactions': { label: 'Greetings',      items: [{ label: 'Wave', description: '/e wave', event: 'Emote', data: 'wave' }] },
        'emotes-reactions':    { label: 'Reactions',      items: [{ label: 'LOL', description: '/e lol', event: 'Emote', data: 'lol' }] },
        'emotes-celebration':  { label: 'Celebration',    items: [{ label: 'Clap', description: '/e clap', event: 'Emote', data: 'clap' }] },
        'emotes-fighting':     { label: 'Fighting',       items: [{ label: 'Boxing', description: '/e boxing', event: 'Emote', data: 'boxing' }] },
    },
    interaction: [
        { id: 1, label: 'Talk', icon: 'comment' },
        { id: 2, label: 'Handcuff', icon: 'lock' },
        { id: 3, label: 'Search', icon: 'magnifying-glass' },
        { id: 4, label: 'Escort', icon: 'hand-holding-hand' },
        { id: 5, label: 'Put In Vehicle', icon: 'car' },
        { id: 6, label: 'Revive', icon: 'heart-pulse' },
    ],
    progress: { label: 'Lockpicking Door...', duration: 8000 },
};

const MOCK_STATUSES = [
    { name: 'PLAYER_HUNGER', icon: 'utensils', color: '#f5a623', options: { id: 1, hideHigh: false, hideZero: false } },
    { name: 'PLAYER_THIRST', icon: 'droplet',  color: '#4fc3f7', options: { id: 2, hideHigh: false, hideZero: false } },
    { name: 'PLAYER_STRESS', icon: 'brain',    color: '#ab47bc', options: { id: 3, hideHigh: false, hideZero: false } },
];

// Mirrors exactly what nos.lua registers on Characters:Client:Spawn
const NOS_STATUS = { name: 'nos', icon: 'gauge-high', color: '#208692', max: 100, flash: true, options: { hideZero: true } };

const useStyles = makeStyles(() => ({
    toggle: {
        position: 'fixed', bottom: 10, left: '50%', transform: 'translateX(-50%)',
        width: 32, height: 32, borderRadius: '50%',
        background: 'rgba(18,16,37,0.9)', border: '1px solid rgba(32,134,146,0.4)',
        color: '#208692', fontSize: 14, display: 'flex', alignItems: 'center',
        justifyContent: 'center', cursor: 'pointer', zIndex: 99999, transition: 'all 0.2s ease',
        '&:hover': { borderColor: '#208692', boxShadow: '0 0 12px rgba(32,134,146,0.3)' },
    },
    panel: {
        position: 'fixed', bottom: 52, left: '50%', transform: 'translateX(-50%)',
        width: 520, background: 'rgba(18,16,37,0.96)', border: '1px solid rgba(32,134,146,0.2)',
        boxShadow: '0 16px 60px rgba(0,0,0,0.7), 0 0 30px rgba(32,134,146,0.05)',
        zIndex: 99999, fontFamily: "'Oswald', sans-serif",
        display: 'flex', flexDirection: 'column', maxHeight: 'calc(100vh - 70px)', overflowY: 'auto',
        '&::-webkit-scrollbar': { width: 4 },
        '&::-webkit-scrollbar-thumb': { background: 'rgba(32,134,146,0.3)', borderRadius: 2 },
        '&::-webkit-scrollbar-track': { background: 'transparent' },
    },
    header: {
        padding: '12px 16px 10px', borderBottom: '1px solid rgba(32,134,146,0.15)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    },
    headerTitle: { fontSize: 11, fontWeight: 600, letterSpacing: '0.25em', textTransform: 'uppercase', color: '#208692' },
    headerSub:   { fontSize: 9, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.1em' },
    section:     { padding: '10px 16px', borderBottom: '1px solid rgba(32,134,146,0.08)' },
    sectionLabel: {
        fontSize: 9, fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase',
        color: 'rgba(32,134,146,0.5)', marginBottom: 8, display: 'block',
    },
    btnRow: { display: 'flex', flexWrap: 'wrap', gap: 6 },
    btn: {
        padding: '6px 12px', background: 'rgba(32,134,146,0.08)', border: '1px solid rgba(32,134,146,0.2)',
        borderRadius: 2, color: 'rgba(255,255,255,0.7)', fontFamily: "'Oswald', sans-serif",
        fontSize: 11, fontWeight: 500, letterSpacing: '0.06em', cursor: 'pointer', transition: 'all 0.15s ease',
        '&:hover': { background: 'rgba(32,134,146,0.18)', borderColor: 'rgba(32,134,146,0.5)', color: '#ffffff' },
    },
    btnActive: {
        background: 'rgba(32,134,146,0.2)', borderColor: '#208692',
        color: '#208692', boxShadow: '0 0 8px rgba(32,134,146,0.2)',
    },
    btnDanger: {
        borderColor: 'rgba(196,64,64,0.3)', color: 'rgba(196,64,64,0.7)',
        '&:hover': { background: 'rgba(196,64,64,0.12)', borderColor: 'rgba(196,64,64,0.5)', color: '#c44040' },
    },
    btnNos: {
        borderColor: 'rgba(0,229,255,0.4)', color: 'rgba(0,229,255,0.8)',
        background: 'rgba(0,229,255,0.08)',
        '&:hover': { background: 'rgba(0,229,255,0.15)', borderColor: 'rgba(0,229,255,0.6)', color: '#00e5ff' },
    },
    btnNosActive: {
        background: 'rgba(0,229,255,0.18)', borderColor: '#00e5ff',
        color: '#00e5ff', boxShadow: '0 0 10px rgba(0,229,255,0.3)',
    },
    sliderGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 16px' },
    sliderRow:  { display: 'flex', flexDirection: 'column', gap: 4 },
    sliderLabel: {
        display: 'flex', justifyContent: 'space-between', fontSize: 10,
        color: 'rgba(255,255,255,0.5)', letterSpacing: '0.08em', textTransform: 'uppercase',
    },
    sliderValue: { color: '#208692', fontWeight: 600 },
    slider: { width: '100%', accentColor: '#208692', cursor: 'pointer' },
    deadRow: { display: 'flex', alignItems: 'center', gap: 8, marginTop: 8 },
    mockMinimap: {
        position: 'fixed',
        bottom: 18,
        left: 18,
        width: 240,
        height: 135,
        background: 'rgba(40,60,80,0.5)',
        border: '2px solid rgba(32,134,146,0.4)',
        zIndex: 1,
        pointerEvents: 'none',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: "'Oswald', sans-serif",
    },
    mockMinimapLabel: {
        fontSize: 11,
        fontWeight: 600,
        letterSpacing: '0.15em',
        textTransform: 'uppercase',
        color: 'rgba(32,134,146,0.6)',
    },
    mockMinimapSub: {
        fontSize: 9,
        color: 'rgba(255,255,255,0.25)',
        letterSpacing: '0.08em',
        marginTop: 2,
    },
    mockMinimapExpanded: {
        width: 280,
        height: 200,
    },
}));

const DevPanel = () => {
    const classes  = useStyles();
    const dispatch = useDispatch();
    const [open, setOpen] = useState(false);
    const [statusesRegistered, setStatusesRegistered] = useState(false);
    const [mockMap, setMockMap] = useState(false);
    const [mockMapExpanded, setMockMapExpanded] = useState(false);

    // Status sliders
    const [health, setHealth] = useState(100);
    const [armor,  setArmor]  = useState(100);
    const [hunger, setHunger] = useState(100);
    const [thirst, setThirst] = useState(100);
    const [stress, setStress] = useState(0);

    // Vehicle state
    const [vSpeed, setVSpeed] = useState(0);
    const [vFuel,  setVFuel]  = useState(100);
    const [vEng,   setVEng]   = useState(100);
    const [vBelt,  setVBelt]  = useState(false);
    const [vUnit,  setVUnit]  = useState('MPH');

    // Nitrous local state — mirrors status.statuses entry "nos"
    const [nosAmount, setNosAmount] = useState(100);

    const listShowing        = useSelector((s) => s.list.showing);
    const actionShowing      = useSelector((s) => s.action.showing);
    const interactionShowing = useSelector((s) => s.interaction.show);
    const progressShowing    = useSelector((s) => s.progress.showing);
    const isDead             = useSelector((s) => s.status.isDead);
    const vehicleShowing     = useSelector((s) => s.vehicle.showing);
    const ammoShowing        = useSelector((s) => s.ammo.showing);
    const armedState         = useSelector((s) => s.app.armed);

    // Nitrous is installed when the "nos" status exists with value > 0
    const nosStatus    = useSelector((s) => s.status.statuses.find((st) => st.name === 'nos'));
    const nosInstalled = !!(nosStatus && nosStatus.value > 0);

    if (!isDev) return null;

    // ── Status helpers ────────────────────────────────────────────────────────
    const ensureStatusesRegistered = () => {
        if (statusesRegistered) return;
        dispatch({ type: 'RESET_STATUSES' });
        MOCK_STATUSES.forEach((s) =>
            dispatch({ type: 'REGISTER_STATUS', payload: { status: { ...s, value: 100, flash: true } } })
        );
        setStatusesRegistered(true);
    };
    const updateHP = (hp, arm) => dispatch({ type: 'UPDATE_HP', payload: { hp, armor: arm } });
    const updateStatusValue = (name, value) => { ensureStatusesRegistered(); dispatch({ type: 'UPDATE_STATUS_VALUE', payload: { name, value } }); };
    const handleHealth = (v) => { const n = Number(v); setHealth(n); updateHP(n, armor); };
    const handleArmor  = (v) => { const n = Number(v); setArmor(n);  updateHP(health, n); };
    const handleHunger = (v) => { const n = Number(v); setHunger(n); updateStatusValue('PLAYER_HUNGER', n); };
    const handleThirst = (v) => { const n = Number(v); setThirst(n); updateStatusValue('PLAYER_THIRST', n); };
    const handleStress = (v) => { const n = Number(v); setStress(n); updateStatusValue('PLAYER_STRESS', n); };
    const toggleDead   = ()  => dispatch({ type: 'SET_DEAD', payload: { state: !isDead } });

    // ── Vehicle helpers ───────────────────────────────────────────────────────
    const toggleVehicle = () => {
        if (vehicleShowing) {
            dispatch({ type: 'HIDE_VEHICLE' });
        } else {
            dispatch({ type: 'SHOW_VEHICLE' });
            dispatch({ type: 'UPDATE_IGNITION',      payload: { ignition: true } });
            dispatch({ type: 'UPDATE_SPEED',         payload: { speed: vSpeed } });
            dispatch({ type: 'UPDATE_FUEL',          payload: { fuel: vFuel, fuelHide: false } });
            dispatch({ type: 'UPDATE_ENGINE_HEALTH', payload: { engineHealth: vEng } });
            dispatch({ type: 'UPDATE_SEATBELT',      payload: { seatbelt: vBelt } });
            dispatch({ type: 'UPDATE_SPEED_MEASURE', payload: { measurement: vUnit } });
        }
    };
    const handleVSpeed = (v) => { const n = Number(v); setVSpeed(n); dispatch({ type: 'UPDATE_SPEED', payload: { speed: n } }); };
    const handleVFuel  = (v) => { const n = Number(v); setVFuel(n);  dispatch({ type: 'UPDATE_FUEL', payload: { fuel: n, fuelHide: false } }); };
    const handleVEng   = (v) => { const n = Number(v); setVEng(n);   dispatch({ type: 'UPDATE_ENGINE_HEALTH', payload: { engineHealth: n } }); };
    const toggleBelt   = ()  => { const next = !vBelt; setVBelt(next); dispatch({ type: 'UPDATE_SEATBELT', payload: { seatbelt: next } }); };
    const toggleUnit   = ()  => { const next = vUnit === 'MPH' ? 'KM/H' : 'MPH'; setVUnit(next); dispatch({ type: 'UPDATE_SPEED_MEASURE', payload: { measurement: next } }); };

    // ── Nitrous helpers — uses real Status system (name: "nos") ──────────────
    const toggleNosInstalled = () => {
        if (nosInstalled) {
            dispatch({ type: 'UPDATE_STATUS_VALUE', payload: { name: 'nos', value: 0 } });
        } else {
            if (!nosStatus) {
                // Not registered yet — register with the amount baked in so hideZero shows it immediately
                dispatch({ type: 'REGISTER_STATUS', payload: { status: { ...NOS_STATUS, value: nosAmount } } });
            } else {
                // Already registered (was installed before), just restore the value
                dispatch({ type: 'UPDATE_STATUS_VALUE', payload: { name: 'nos', value: nosAmount } });
            }
        }
    };
    const handleNosAmount = (v) => {
        const n = Number(v);
        setNosAmount(n);
        if (nosInstalled) {
            dispatch({ type: 'UPDATE_STATUS_VALUE', payload: { name: 'nos', value: n } });
        }
    };

    // ── Component toggles ─────────────────────────────────────────────────────
    const toggleAction      = () => actionShowing      ? dispatch({ type: 'HIDE_ACTION' }) : dispatch({ type: 'SHOW_ACTION', payload: TEST_DATA.action });
    const toggleList        = () => listShowing        ? dispatch({ type: 'CLOSE_LIST_MENU' }) : dispatch({ type: 'SET_LIST_MENU', payload: { menus: TEST_DATA.listMenu } });
    const toggleProgress    = () => progressShowing    ? dispatch({ type: 'HIDE_PROGRESS' }) : dispatch({ type: 'START_PROGRESS', payload: TEST_DATA.progress });
    const toggleInteraction = () => {
        if (interactionShowing) { dispatch({ type: 'SHOW_INTERACTION_MENU', payload: { toggle: false } }); }
        else { dispatch({ type: 'SET_INTERACTION_MENU_ITEMS', payload: { items: TEST_DATA.interaction } }); dispatch({ type: 'SHOW_INTERACTION_MENU', payload: { toggle: true } }); }
    };
    // ── Ammo toggle ──────────────────────────────────────────────────────────
    const toggleAmmo = () => {
        if (ammoShowing && armedState) {
            dispatch({ type: 'HIDE_AMMO', payload: {} });
            dispatch({ type: 'ARMED', payload: { state: false } });
        } else {
            dispatch({ type: 'ARMED', payload: { state: true } });
            dispatch({ type: 'UPDATE_AMMO', payload: { current: 24, reserve: 96, weaponLabel: 'Carbine Rifle' } });
        }
    };

    const fireNotification   = (type) => dispatch({ type: 'ADD_ALERT', payload: { notification: { ...TEST_DATA.notifications[type] } } });
    const clearNotifications = () => dispatch({ type: 'CLEAR_ALERTS' });

    return (
        <>
            {mockMap && (
                <div className={`${classes.mockMinimap}${mockMapExpanded ? ` ${classes.mockMinimapExpanded}` : ''}`}>
                    <span className={classes.mockMinimapLabel}>Minimap</span>
                    <span className={classes.mockMinimapSub}>{mockMapExpanded ? '280×200 (vehicle)' : '240×135 (on foot)'}</span>
                </div>
            )}
            <div className={classes.toggle} onClick={() => setOpen(!open)}>
                <FontAwesomeIcon icon={['fas', open ? 'xmark' : 'wrench']} />
            </div>

            {open && (
                <div className={classes.panel}>
                    <div className={classes.header}>
                        <span className={classes.headerTitle}>Dev Panel</span>
                        <span className={classes.headerSub}>UI Testing</span>
                    </div>

                    {/* ── Status Bars ── */}
                    <div className={classes.section}>
                        <span className={classes.sectionLabel}>Status Bars</span>
                        <div className={classes.sliderGrid}>
                            {[
                                { label: 'Health', val: health, set: handleHealth },
                                { label: 'Armor',  val: armor,  set: handleArmor },
                                { label: 'Hunger', val: hunger, set: handleHunger },
                                { label: 'Thirst', val: thirst, set: handleThirst },
                                { label: 'Stress', val: stress, set: handleStress },
                            ].map(({ label, val, set }) => (
                                <div key={label} className={classes.sliderRow}>
                                    <div className={classes.sliderLabel}>
                                        <span>{label}</span>
                                        <span className={classes.sliderValue}>{val}</span>
                                    </div>
                                    <input className={classes.slider} type="range" min="0" max="100" value={val} onChange={(e) => set(e.target.value)} />
                                </div>
                            ))}
                        </div>
                        <div className={classes.deadRow}>
                            <button className={`${classes.btn}${isDead ? ` ${classes.btnDanger}` : ''}`} onClick={toggleDead}>
                                <FontAwesomeIcon icon="skull-crossbones" style={{ marginRight: 6 }} />
                                {isDead ? 'Revive' : 'Toggle Dead'}
                            </button>
                        </div>
                    </div>

                    {/* ── Speedometer ── */}
                    <div className={classes.section}>
                        <span className={classes.sectionLabel}>Speedometer</span>
                        <div className={classes.btnRow} style={{ marginBottom: 10 }}>
                            <button className={`${classes.btn}${vehicleShowing ? ` ${classes.btnActive}` : ''}`} onClick={toggleVehicle}>
                                <FontAwesomeIcon icon="car" style={{ marginRight: 6 }} />
                                {vehicleShowing ? 'Hide Speedo' : 'Show Speedo'}
                            </button>
                            <button className={`${classes.btn}${vBelt ? ` ${classes.btnActive}` : ''}`} onClick={toggleBelt}>
                                <FontAwesomeIcon icon="shield" style={{ marginRight: 6 }} />
                                Belt {vBelt ? 'ON' : 'OFF'}
                            </button>
                            <button className={classes.btn} onClick={toggleUnit}>
                                <FontAwesomeIcon icon="gauge-high" style={{ marginRight: 6 }} />
                                {vUnit}
                            </button>
                        </div>
                        <div className={classes.sliderGrid}>
                            {[
                                { label: 'Speed',         val: vSpeed, max: 220, set: handleVSpeed },
                                { label: 'Fuel',          val: vFuel,  max: 100, set: handleVFuel },
                                { label: 'Engine Health', val: vEng,   max: 100, set: handleVEng },
                            ].map(({ label, val, max, set }) => (
                                <div key={label} className={classes.sliderRow}>
                                    <div className={classes.sliderLabel}>
                                        <span>{label}</span>
                                        <span className={classes.sliderValue}>{val}</span>
                                    </div>
                                    <input className={classes.slider} type="range" min="0" max={max} value={val} onChange={(e) => set(e.target.value)} />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* ── Nitrous ── */}
                    <div className={classes.section}>
                        <span className={classes.sectionLabel}>Nitrous</span>
                        <div className={classes.btnRow} style={{ marginBottom: 10 }}>
                            <button
                                className={`${classes.btn} ${classes.btnNos}${nosInstalled ? ` ${classes.btnNosActive}` : ''}`}
                                onClick={toggleNosInstalled}>
                                <FontAwesomeIcon icon="bolt" style={{ marginRight: 6 }} />
                                {nosInstalled ? 'Installed' : 'Not Installed'}
                            </button>
                        </div>
                        <div className={classes.sliderGrid}>
                            <div className={classes.sliderRow}>
                                <div className={classes.sliderLabel}>
                                    <span>Amount</span>
                                    <span style={{ color: '#00e5ff', fontWeight: 600 }}>{nosInstalled ? (nosStatus?.value ?? nosAmount) : nosAmount}</span>
                                </div>
                                <input
                                    className={classes.slider}
                                    style={{ accentColor: '#00e5ff' }}
                                    type="range" min="1" max="100"
                                    value={nosInstalled ? (nosStatus?.value ?? nosAmount) : nosAmount}
                                    onChange={(e) => handleNosAmount(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    {/* ── Toggle Components ── */}
                    <div className={classes.section}>
                        <span className={classes.sectionLabel}>Toggle Components</span>
                        <div className={classes.btnRow}>
                            <button className={`${classes.btn}${actionShowing ? ` ${classes.btnActive}` : ''}`} onClick={toggleAction}>Action Text</button>
                            <button className={`${classes.btn}${listShowing ? ` ${classes.btnActive}` : ''}`} onClick={toggleList}>List Menu</button>
                            <button className={`${classes.btn}${interactionShowing ? ` ${classes.btnActive}` : ''}`} onClick={toggleInteraction}>Interaction Wheel</button>
                            <button className={`${classes.btn}${progressShowing ? ` ${classes.btnActive}` : ''}`} onClick={toggleProgress}>Progress Bar</button>
                            <button className={`${classes.btn}${ammoShowing && armedState ? ` ${classes.btnActive}` : ''}`} onClick={toggleAmmo}>Ammo Counter</button>
                            <button className={`${classes.btn}${mockMap ? ` ${classes.btnActive}` : ''}`} onClick={() => setMockMap(!mockMap)}>Mock Minimap</button>
                            {mockMap && (
                                <button className={`${classes.btn}${mockMapExpanded ? ` ${classes.btnActive}` : ''}`} onClick={() => setMockMapExpanded(!mockMapExpanded)}>
                                    {mockMapExpanded ? 'Vehicle Size' : 'On Foot Size'}
                                </button>
                            )}
                        </div>
                    </div>

                    {/* ── Notifications ── */}
                    <div className={classes.section}>
                        <span className={classes.sectionLabel}>Fire Notifications</span>
                        <div className={classes.btnRow}>
                            <button className={classes.btn} onClick={() => fireNotification('success')}>Success</button>
                            <button className={classes.btn} onClick={() => fireNotification('info')}>Info</button>
                            <button className={classes.btn} onClick={() => fireNotification('warning')}>Warning</button>
                            <button className={classes.btn} onClick={() => fireNotification('error')}>Error</button>
                            <button className={classes.btn} onClick={() => fireNotification('persistent')}>Persistent</button>
                            <button className={`${classes.btn} ${classes.btnDanger}`} onClick={clearNotifications}>Clear All</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default DevPanel;
