import React, { useRef } from 'react';
import { useSelector } from 'react-redux';
import { Box, Fade } from '@mui/material';
import { styled } from '@mui/material/styles';

// ── Theme constants ────────────────────────────────────────────────────────
const TEAL       = '#208692';
const TEAL_DIM   = 'rgba(32,134,146,0.6)';
const TEAL_FAINT = 'rgba(32,134,146,0.12)';

const statusColor = (val) =>
  val >= 40 ? TEAL : val >= 20 ? '#f09348' : '#c0392b';

// ── Gauge geometry ─────────────────────────────────────────────────────────
const SIZE       = 260;
const CX         = SIZE / 2;
const CY         = SIZE / 2;
const R          = 118;
const START_DEG  = 135;
const TOTAL_DEG  = 270;
const MAX_SPEED  = 220;
const TICK_COUNT = 13;

// ── Status bar geometry ────────────────────────────────────────────────────
const BAR_W    = 36;
const BAR_H    = 3;
const BAR_R    = 1.5;
const ITEM_GAP = 8;
const TOTAL_BW = 3 * BAR_W + 2 * ITEM_GAP;
const BX0      = CX - TOTAL_BW / 2;
const BAR_Y    = CY + 78;
const LABEL_Y  = BAR_Y - 11;

const toRad  = (d) => (d * Math.PI) / 180;
const arcLen = (r, deg) => 2 * Math.PI * r * (deg / 360);

// ── Styled ─────────────────────────────────────────────────────────────────
const Container = styled(Box)(() => ({
  position: 'absolute',
  bottom: 20,
  right: 20,
  zIndex: 1000,
}));

const SpeedWrap = styled(Box)(() => ({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -60%)',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  pointerEvents: 'none',
}));

// ── Component ──────────────────────────────────────────────────────────────
const Speedometer = () => {
  const containerRef = useRef(null);

  const showing          = useSelector((s) => s.vehicle.showing);
  const ignition         = useSelector((s) => s.vehicle.ignition);
  const speed            = useSelector((s) => s.vehicle.speed);
  const speedMeasure     = useSelector((s) => s.vehicle.speedMeasure || 'MPH');
  const seatbelt         = useSelector((s) => s.vehicle.seatbelt);
  const engineHealth     = useSelector((s) => s.vehicle.engineHealth || 100);
  const engineHealthHide = useSelector((s) => s.vehicle.engineHealthHide);
  const fuelHide         = useSelector((s) => s.vehicle.fuelHide);
  const fuel             = useSelector((s) => {
    const f = s.vehicle.fuel;
    if (f === null || f === undefined || typeof f !== 'number' || isNaN(f)) {
      return s.vehicle.showing ? 0 : 100;
    }
    return Math.max(0, Math.min(100, f));
  });

  // ── Speed arc ──
  const speedPct  = Math.min(speed / MAX_SPEED, 1);
  const speedDeg  = speedPct * TOTAL_DEG;
  const totalCirc = 2 * Math.PI * R;
  const trackLen  = arcLen(R, TOTAL_DEG);
  const fillLen   = arcLen(R, speedDeg);

  // Needle tip
  const nRad = toRad(START_DEG + speedDeg);
  const nX   = CX + R * Math.cos(nRad);
  const nY   = CY + R * Math.sin(nRad);

  // Status bar colors + fill widths
  const fuelColor = fuelHide         ? 'rgba(255,255,255,0.08)' : statusColor(fuel);
  const engColor  = engineHealthHide ? 'rgba(255,255,255,0.08)' : statusColor(engineHealth);
  const beltColor = seatbelt ? TEAL : 'rgba(255,255,255,0.12)';
  const fuelFill  = fuelHide         ? 0 : (fuel / 100) * BAR_W;
  const engFill   = engineHealthHide ? 0 : (engineHealth / 100) * BAR_W;

  const items = [
    { label: 'FUEL', x: BX0,                          color: fuelColor, fill: fuelFill, depletes: true  },
    { label: 'ENG',  x: BX0 + BAR_W + ITEM_GAP,       color: engColor,  fill: engFill,  depletes: true  },
    { label: 'BELT', x: BX0 + (BAR_W + ITEM_GAP) * 2, color: beltColor, fill: BAR_W,    depletes: false },
  ];

  return (
    <Fade in={showing && ignition}>
      <Container ref={containerRef}>
        <Box sx={{ position: 'relative', width: SIZE, height: SIZE }}>

          <svg
            width={SIZE}
            height={SIZE}
            style={{ position: 'absolute', top: 0, left: 0, overflow: 'visible' }}
          >
            <defs>
              <linearGradient id="arcGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%"   stopColor="#1a6b75" />
                <stop offset="100%" stopColor={TEAL} />
              </linearGradient>
              <filter id="arcGlow" x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
              <filter id="dotGlow" x="-150%" y="-150%" width="400%" height="400%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
              <filter id="barGlow" x="-5%" y="-100%" width="110%" height="300%">
                <feGaussianBlur stdDeviation="1.5" result="blur" />
                <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
            </defs>

            {/* Faint outer ring */}
            <circle cx={CX} cy={CY} r={R + 8}
              fill="none" stroke={TEAL_FAINT} strokeWidth="1" />

            {/* Speed track — white */}
            <circle cx={CX} cy={CY} r={R}
              fill="none"
              stroke="rgba(255,255,255,0.25)"
              strokeWidth="10"
              strokeDasharray={`${trackLen} ${totalCirc}`}
              strokeLinecap="round"
              transform={`rotate(${START_DEG} ${CX} ${CY})`}
            />

            {/* Active speed arc */}
            {speed > 0 && (
              <circle cx={CX} cy={CY} r={R}
                fill="none"
                stroke="url(#arcGrad)"
                strokeWidth="10"
                strokeDasharray={`${fillLen} ${totalCirc}`}
                strokeLinecap="round"
                transform={`rotate(${START_DEG} ${CX} ${CY})`}
                filter="url(#arcGlow)"
                style={{ transition: 'stroke-dasharray 0.12s ease' }}
              />
            )}

            {/* Tick marks — white */}
            {Array.from({ length: TICK_COUNT }).map((_, i) => {
              const deg    = START_DEG + (i / (TICK_COUNT - 1)) * TOTAL_DEG;
              const rad    = toRad(deg);
              const isMaj  = i % 3 === 0;
              const rOuter = R - 14;
              const rInner = isMaj ? R - 26 : R - 20;
              const active = speedDeg >= (i / (TICK_COUNT - 1)) * TOTAL_DEG;
              return (
                <line key={i}
                  x1={CX + rOuter * Math.cos(rad)} y1={CY + rOuter * Math.sin(rad)}
                  x2={CX + rInner * Math.cos(rad)} y2={CY + rInner * Math.sin(rad)}
                  stroke={active ? TEAL : 'rgba(255,255,255,0.7)'}
                  strokeWidth={isMaj ? 2 : 1}
                  strokeLinecap="round"
                  style={{ transition: 'stroke 0.12s ease' }}
                />
              );
            })}

            {/* Needle dot */}
            {speed > 0 && (
              <circle cx={nX} cy={nY} r="5"
                fill={TEAL}
                filter="url(#dotGlow)"
                style={{ transition: 'cx 0.12s ease, cy 0.12s ease' }}
              />
            )}

            {/* ── Status bars ── */}
            {items.map(({ label, x, color, fill, depletes }) => (
              <React.Fragment key={label}>
                <text
                  x={x + BAR_W / 2} y={LABEL_Y}
                  textAnchor="middle" dominantBaseline="middle"
                  fill="#ffffff" fontSize="9"
                  fontFamily="'Rajdhani', sans-serif"
                  fontWeight="700" letterSpacing="0.14em"
                >
                  {label}
                </text>
                <rect x={x} y={BAR_Y} width={BAR_W} height={BAR_H}
                  rx={BAR_R} ry={BAR_R} fill="rgba(255,255,255,0.2)" />
                {(depletes ? fill > 0 : seatbelt) && (
                  <rect
                    x={x} y={BAR_Y}
                    width={depletes ? fill : BAR_W} height={BAR_H}
                    rx={BAR_R} ry={BAR_R}
                    fill={color} filter="url(#barGlow)"
                    style={{ transition: 'width 0.35s ease, fill 0.35s ease' }}
                  />
                )}
              </React.Fragment>
            ))}
          </svg>

          {/* Speed readout */}
          <SpeedWrap>
            <Box sx={{
              fontFamily: "'Orbitron', sans-serif",
              fontSize: 46, fontWeight: 700, color: '#ffffff',
              letterSpacing: '0.02em', lineHeight: 1,
              textShadow: '0 0 24px rgba(255,255,255,0.12)',
            }}>
              {speed}
            </Box>
            <Box sx={{
              fontFamily: "'Rajdhani', sans-serif",
              fontSize: 12, fontWeight: 700,
              letterSpacing: '0.26em', textTransform: 'uppercase',
              color: TEAL_DIM, mt: '6px',
            }}>
              {speedMeasure}
            </Box>
          </SpeedWrap>

        </Box>
      </Container>
    </Fade>
  );
};

export default Speedometer;
