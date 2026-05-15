// Cookbook direction — warm editorial. Instrument Serif display, IBM Plex
// Sans body, cream paper, terracotta accent. Calm + confident.

const C = {
  paper: '#f6efe3',
  paperDeep: '#ede2cd',
  ink: '#211c14',
  inkDim: '#5a4f3a',
  inkFaint: '#8a7d62',
  rule: 'rgba(33,28,20,0.12)',
  ruleSoft: 'rgba(33,28,20,0.06)',
  accent: '#b04a28',
  accentDim: '#d8apex',
  card: '#fffaee',
  fontDisplay: 'var(--cookbook-display, "Instrument Serif", "Source Serif 4", Georgia, serif)',
  fontBody: '"IBM Plex Sans", -apple-system, system-ui, sans-serif',
  fontMono: '"IBM Plex Mono", ui-monospace, monospace',
};

// Abstract dish "plate" — radial gradient bowl with a soft inner ring and
// highlight. Reads as "a meal" without committing to a specific look.
function DishPlate({ meal, size = 88, ringless = false }) {
  if (!meal) return null;
  const [a, b] = meal.tint;
  return (
    <div style={{
      width: size, height: size, borderRadius: size,
      background: `radial-gradient(circle at 32% 28%, ${a} 0%, ${b} 78%)`,
      boxShadow: ringless ? 'none' : `inset 0 0 0 4px rgba(255,255,255,0.18), 0 6px 18px ${b}40`,
      position: 'relative', flexShrink: 0,
      overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute', top: '14%', left: '14%', width: '72%', height: '72%',
        borderRadius: '50%',
        background: `radial-gradient(circle at 38% 30%, ${a}cc 10%, ${b}ff 65%, ${b}aa 100%)`,
        boxShadow: `inset 6px 8px 18px ${a}66, inset -4px -6px 12px ${b}cc`,
      }} />
      <div style={{
        position: 'absolute', top: '20%', left: '24%', width: '24%', height: '12%',
        borderRadius: '50%', background: '#fff', opacity: 0.18, filter: 'blur(2px)',
      }} />
    </div>
  );
}

// Index card style chip.
function CTag({ children }) {
  return (
    <span style={{
      fontFamily: C.fontMono, fontSize: 9.5, letterSpacing: 0.8, textTransform: 'uppercase',
      color: C.inkDim, padding: '3px 7px', border: `0.5px solid ${C.rule}`, borderRadius: 2,
    }}>{children}</span>
  );
}

// Day row card. The dot turns burnt-orange when "Eating out."
function CDayRow({ day, meal, slot, onTap, eatingOut, showKcal, idx }) {
  return (
    <div onClick={onTap} style={{
      display: 'flex', gap: 14, alignItems: 'flex-start',
      padding: '14px 18px',
      borderTop: idx === 0 ? 'none' : `0.5px solid ${C.ruleSoft}`,
      cursor: 'pointer',
      opacity: eatingOut ? 0.42 : 1,
    }}>
      <div style={{ width: 38, paddingTop: 4 }}>
        <div style={{ fontFamily: C.fontMono, fontSize: 10, letterSpacing: 1.4, color: C.inkFaint, textTransform: 'uppercase' }}>{day.day}</div>
        <div style={{ fontFamily: C.fontDisplay, fontSize: 22, color: C.ink, lineHeight: 1, marginTop: 4, fontStyle: 'italic' }}>{slot === 'lunch' ? '12' : '19'}</div>
      </div>
      {eatingOut ? (
        <div style={{ flex: 1, paddingTop: 6, display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 24, height: 1, background: C.inkDim }} />
          <span style={{ fontFamily: C.fontMono, fontSize: 11, letterSpacing: 1, color: C.inkDim, textTransform: 'uppercase' }}>Eating out</span>
        </div>
      ) : (
        <>
          <DishPlate meal={meal} size={56} />
          <div style={{ flex: 1, minWidth: 0, paddingTop: 2 }}>
            <div style={{ fontFamily: C.fontDisplay, fontSize: 21, color: C.ink, lineHeight: 1.1, letterSpacing: -0.2 }}>{meal.name}</div>
            <div style={{ fontFamily: C.fontBody, fontSize: 12.5, color: C.inkDim, marginTop: 3, lineHeight: 1.35 }}>{meal.sub}</div>
            <div style={{ display: 'flex', gap: 6, marginTop: 8, flexWrap: 'wrap' }}>
              <CTag>{meal.time} min</CTag>
              {showKcal && <CTag>{meal.kcal} kcal</CTag>}
              {meal.tags.slice(0,1).map(t => <CTag key={t}>{t}</CTag>)}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function CookbookApp({ tweaks }) {
  const { daysCount = 5, showKcal = false, shuffleStyle = 'cards' } = tweaks || {};
  const [seed, setSeed] = React.useState(7);
  const [meals, setMeals] = React.useState(MEALS);
  const [neverAgain, setNeverAgain] = React.useState(new Set());
  const [favorites, setFavorites] = React.useState(new Set());
  // Active pool excludes "never again" meals.
  const activeMeals = React.useMemo(
    () => meals.filter(m => !neverAgain.has(m.id)),
    [meals, neverAgain]
  );
  const [plan, setPlan] = React.useState(() => makePlan(daysCount, 7, MEALS));
  const [shuffling, setShuffling] = React.useState(false);
  const [activeSlot, setActiveSlot] = React.useState('lunch'); // 'lunch' | 'dinner'
  const [sheet, setSheet] = React.useState(null); // { kind, ...payload }
  const [pantry, setPantry] = React.useState(new Set(['rice','onion','tomato','garlic','olive_oil','cumin','turmeric']));
  const shoppingCount = React.useMemo(
    () => Object.values(buildShoppingList(plan, pantry)).reduce((n, a) => n + a.length, 0),
    [plan, pantry]
  );

  React.useEffect(() => { setPlan(makePlan(daysCount, seed, activeMeals)); }, [daysCount]);

  const shuffle = () => {
    if (shuffling) return;
    setShuffling(true);
    setTimeout(() => {
      const next = seed + 1;
      setSeed(next);
      setPlan(p => p.map((d, i) => {
        if (d.eatingOut) return d;
        const fresh = makePlan(daysCount, next, activeMeals)[i];
        return { ...d, lunch: fresh.lunch, dinner: fresh.dinner };
      }));
    }, shuffleStyle === 'cards' ? 700 : shuffleStyle === 'slot' ? 300 : 200);
    setTimeout(() => setShuffling(false), shuffleStyle === 'cards' ? 1500 : 1100);
  };

  const toggleEatOut = (i) => setPlan(p => p.map((d, idx) => idx === i ? { ...d, eatingOut: !d.eatingOut } : d));
  const swap = (i, slot) => {
    const usedToday = new Set(plan.map((d, idx) => idx !== i ? d[slot]?.id : null));
    const pool = activeMeals.filter(m =>
      m.type.includes(slot) && m.id !== plan[i][slot].id && !usedToday.has(m.id)
    );
    if (!pool.length) return;
    const next = pool[Math.floor(Math.random() * pool.length)];
    setPlan(p => p.map((d, idx) => idx === i ? { ...d, [slot]: next } : d));
  };
  const addCustomMeal = (input) => {
    const m = makeCustomMeal(input);
    setMeals(prev => [...prev, m]);
    return m;
  };
  const removeMeal = (id) => {
    setMeals(prev => prev.filter(m => m.id !== id));
    setNeverAgain(prev => { const n = new Set(prev); n.delete(id); return n; });
    setFavorites(prev => { const n = new Set(prev); n.delete(id); return n; });
  };
  const toggleFavorite = (id) => setFavorites(p => { const n = new Set(p); n.has(id) ? n.delete(id) : n.add(id); n.size && neverAgain.has(id) && setNeverAgain(x => { const y = new Set(x); y.delete(id); return y; }); return n; });
  const toggleNeverAgain = (id) => setNeverAgain(p => { const n = new Set(p); if (n.has(id)) n.delete(id); else { n.add(id); setFavorites(x => { const y = new Set(x); y.delete(id); return y; }); } return n; });

  return (
    <div style={{ height: '100%', background: C.paper, color: C.ink, fontFamily: C.fontBody, position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      <CookbookHeader shoppingCount={shoppingCount} onShop={() => setSheet({ kind: 'shopping' })} />
      <div style={{ flex: 1, overflow: 'auto', paddingBottom: 110 }}>
        <CookbookHero plan={plan} daysCount={daysCount} />
        <CookbookSlotTabs slot={activeSlot} onChange={setActiveSlot} />
        <div style={{ position: 'relative' }}>
          <ShuffleOverlay shuffling={shuffling} style={shuffleStyle} plan={plan} slot={activeSlot} />
          <div style={{ opacity: shuffling ? 0 : 1, transition: 'opacity 0.2s' }}>
            {plan.map((d, i) => (
              <CDayRow key={i} idx={i} day={d}
                meal={d[activeSlot]} slot={activeSlot}
                eatingOut={d.eatingOut} showKcal={showKcal}
                onTap={() => setSheet({ kind: 'meal', dayIdx: i, slot: activeSlot })}
              />
            ))}
          </div>
        </div>
        <CookbookFooterMeta plan={plan} pantry={pantry}
          onShoppingList={() => setSheet({ kind: 'shopping' })}
          onPantry={() => setSheet({ kind: 'pantry' })} />
      </div>
      <CookbookBottomBar
        onShuffle={shuffle} shuffling={shuffling}
        onPantry={() => setSheet({ kind: 'pantry' })}
        onShop={() => setSheet({ kind: 'shopping' })}
      />
      {sheet && (
        <CookbookSheet sheet={sheet} plan={plan} pantry={pantry}
          meals={meals} favorites={favorites} neverAgain={neverAgain}
          onClose={() => setSheet(null)}
          onToggleEatOut={toggleEatOut}
          onSwap={swap}
          setPantry={setPantry}
          onAddCustomMeal={addCustomMeal}
          onRemoveMeal={removeMeal}
          onToggleFavorite={toggleFavorite}
          onToggleNeverAgain={toggleNeverAgain}
          onShuffle={shuffle}
        />
      )}
    </div>
  );
}

function CookbookHeader({ shoppingCount = 0, onShop }) {
  return (
    <div style={{ paddingTop: 'max(44px, env(safe-area-inset-top, 44px))', paddingLeft: 22, paddingRight: 22, paddingBottom: 12, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <div style={{ fontFamily: C.fontMono, fontSize: 11, letterSpacing: 2, color: C.inkDim, textTransform: 'uppercase' }}>No. 19 · The Week</div>
      <button onClick={onShop} style={{ position: 'relative', width: 36, height: 36, borderRadius: 18, border: `0.5px solid ${C.rule}`, background: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.ink, cursor: 'pointer' }}>
        <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"><path d="M5 6h10l-1 9.5H6L5 6zM7.5 6V4a2.5 2.5 0 015 0v2"/></svg>
        {shoppingCount > 0 && (
          <span style={{ position: 'absolute', top: -4, right: -4, minWidth: 16, height: 16, borderRadius: 8, background: C.accent, color: C.paper, fontFamily: C.fontMono, fontSize: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 3px' }}>{shoppingCount}</span>
        )}
      </button>
    </div>
  );
}

function CookbookHero({ plan, daysCount }) {
  const eatingOut = plan.filter(d => d.eatingOut).length;
  const cooking = daysCount - eatingOut;
  return (
    <div style={{ padding: '14px 22px 22px' }}>
      <div style={{ fontFamily: C.fontDisplay, fontSize: 'clamp(34px, 11vw, 52px)', lineHeight: 1, letterSpacing: -1, color: C.ink, fontWeight: 400, whiteSpace: 'nowrap' }}>
        Plan for <em style={{ color: C.accent, fontStyle: 'italic' }}>this week</em>
      </div>
      <div style={{ marginTop: 18, display: 'flex', gap: 22, alignItems: 'center' }}>
        <div>
          <div style={{ fontFamily: C.fontDisplay, fontSize: 28, color: C.ink, fontStyle: 'italic' }}>{cooking}</div>
          <div style={{ fontFamily: C.fontMono, fontSize: 9.5, letterSpacing: 1.2, color: C.inkFaint, textTransform: 'uppercase' }}>cooking</div>
        </div>
        <div style={{ width: 1, height: 28, background: C.rule }} />
        <div>
          <div style={{ fontFamily: C.fontDisplay, fontSize: 28, color: C.ink, fontStyle: 'italic' }}>{eatingOut}</div>
          <div style={{ fontFamily: C.fontMono, fontSize: 9.5, letterSpacing: 1.2, color: C.inkFaint, textTransform: 'uppercase' }}>eating out</div>
        </div>
        <div style={{ width: 1, height: 28, background: C.rule }} />
        <div>
          <div style={{ fontFamily: C.fontDisplay, fontSize: 28, color: C.ink, fontStyle: 'italic' }}>{cooking * 2}</div>
          <div style={{ fontFamily: C.fontMono, fontSize: 9.5, letterSpacing: 1.2, color: C.inkFaint, textTransform: 'uppercase' }}>meals total</div>
        </div>
      </div>
    </div>
  );
}

function CookbookSlotTabs({ slot, onChange }) {
  return (
    <div style={{ display: 'flex', gap: 0, padding: '0 22px', borderBottom: `0.5px solid ${C.rule}`, marginBottom: 4 }}>
      {[
        { k: 'lunch', label: 'Lunch', sub: 'midday' },
        { k: 'dinner', label: 'Dinner', sub: 'evening' },
      ].map(t => (
        <button key={t.k} onClick={() => onChange(t.k)} style={{
          flex: 1, background: 'transparent', border: 'none', padding: '14px 0 12px', cursor: 'pointer',
          textAlign: 'left', position: 'relative', fontFamily: 'inherit', color: 'inherit',
        }}>
          <div style={{ fontFamily: C.fontDisplay, fontSize: 24, color: slot === t.k ? C.ink : C.inkFaint, fontStyle: slot === t.k ? 'italic' : 'normal', lineHeight: 1 }}>{t.label}</div>
          <div style={{ fontFamily: C.fontMono, fontSize: 9, letterSpacing: 1, color: C.inkFaint, textTransform: 'uppercase', marginTop: 4 }}>{t.sub}</div>
          {slot === t.k && <div style={{ position: 'absolute', bottom: -0.5, left: 0, width: 28, height: 1.5, background: C.accent }} />}
        </button>
      ))}
    </div>
  );
}

function CookbookFooterMeta({ plan, pantry, onShoppingList, onPantry }) {
  const list = buildShoppingList(plan, pantry);
  const itemCount = Object.values(list).reduce((n, arr) => n + arr.length, 0);
  return (
    <div style={{ padding: '18px 22px 30px', display: 'flex', flexDirection: 'column', gap: 0 }}>
      <button onClick={onShoppingList} style={{
        background: 'transparent', border: 'none', borderTop: `0.5px solid ${C.rule}`, padding: '18px 0',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer',
        textAlign: 'left', color: C.ink, fontFamily: 'inherit',
      }}>
        <div>
          <div style={{ fontFamily: C.fontDisplay, fontSize: 22, fontStyle: 'italic' }}>Shopping list</div>
          <div style={{ fontFamily: C.fontMono, fontSize: 10, letterSpacing: 0.8, color: C.inkFaint, textTransform: 'uppercase', marginTop: 2 }}>{itemCount} items to buy</div>
        </div>
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke={C.inkDim} strokeWidth="1.2" strokeLinecap="round"><path d="M3 7h8M7.5 3.5L11 7l-3.5 3.5"/></svg>
      </button>
      <button onClick={onPantry} style={{
        background: 'transparent', border: 'none', borderTop: `0.5px solid ${C.rule}`, padding: '18px 0',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer',
        textAlign: 'left', color: C.ink, fontFamily: 'inherit',
      }}>
        <div>
          <div style={{ fontFamily: C.fontDisplay, fontSize: 22, fontStyle: 'italic' }}>What's in your kitchen</div>
          <div style={{ fontFamily: C.fontMono, fontSize: 10, letterSpacing: 0.8, color: C.inkFaint, textTransform: 'uppercase', marginTop: 2 }}>{pantry.size} items on hand</div>
        </div>
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke={C.inkDim} strokeWidth="1.2" strokeLinecap="round"><path d="M3 7h8M7.5 3.5L11 7l-3.5 3.5"/></svg>
      </button>
    </div>
  );
}

function CookbookBottomBar({ onShuffle, shuffling, onPantry, onShop }) {
  return (
    <div style={{
      position: 'absolute', bottom: 0, left: 0, right: 0,
      paddingTop: 14, paddingLeft: 14, paddingRight: 14,
      paddingBottom: 'max(30px, calc(env(safe-area-inset-bottom, 0px) + 14px))',
      background: `linear-gradient(to top, ${C.paper} 60%, ${C.paper}00)`,
      display: 'flex', gap: 10, alignItems: 'center',
    }}>
      <button onClick={onPantry} title="Pantry" style={iconButton(C)}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M8 3h8l1 3H7L8 3z"/>
          <rect x="6" y="6" width="12" height="15" rx="2"/>
          <path d="M9 11h6M9 14h4"/>
        </svg>
      </button>
      <button onClick={onShop} title="Shopping list" style={{ ...iconButton(C), background: C.accent, color: C.paper, border: 'none' }}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
          <path d="M6 7h12l-1.5 11H7.5L6 7zM9 7V5a3 3 0 016 0v2"/>
        </svg>
      </button>
      <button onClick={onShuffle} disabled={shuffling} style={{
        flex: 1, height: 58, borderRadius: 29, border: 'none', cursor: shuffling ? 'wait' : 'pointer',
        background: C.ink, color: C.paper, display: 'flex', alignItems: 'center', justifyContent: 'center',
        gap: 8, fontFamily: C.fontDisplay, fontSize: 19, fontStyle: 'italic',
      }}>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" style={{ transition: 'transform 0.6s', transform: shuffling ? 'rotate(360deg)' : 'none' }}><path d="M11 3l3 3-3 3M2 6h8M5 13l-3-3 3-3M14 10H6"/></svg>
        {shuffling ? 'Shuffling…' : 'Shuffle the week'}
      </button>
    </div>
  );
}

function iconButton(c) {
  return {
    width: 58, height: 58, borderRadius: 29, border: `0.5px solid ${c.rule}`,
    background: c.card, color: c.ink, cursor: 'pointer',
    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  };
}

// ─── Shuffle animation overlays ───────────────────────────────────────
function ShuffleOverlay({ shuffling, style, plan, slot }) {
  if (!shuffling) return null;
  if (style === 'cards') return <CardShuffleOverlay plan={plan} slot={slot} />;
  if (style === 'slot') return <SlotShuffleOverlay plan={plan} slot={slot} />;
  return <StaggerShuffleOverlay plan={plan} slot={slot} />;
}

function CardShuffleOverlay({ plan, slot }) {
  // Stack of meal cards fanning out and snapping back into place.
  const meals = MEALS.filter(m => m.type.includes(slot)).slice(0, 6);
  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 5, pointerEvents: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <style>{`@keyframes fan-${slot} {
        0% { transform: translate(-50%, -50%) rotate(0deg) translateY(0); opacity: 0; }
        20% { opacity: 1; }
        50% { transform: translate(-50%, -50%) rotate(var(--r)) translateY(-12px); opacity: 1; }
        85% { transform: translate(-50%, -50%) rotate(0deg) translateY(0); opacity: 1; }
        100% { transform: translate(-50%, -50%) rotate(0deg) translateY(0); opacity: 0; }
      }`}</style>
      {meals.map((m, i) => (
        <div key={m.id} style={{
          position: 'absolute', top: '50%', left: '50%', width: 140, height: 180,
          borderRadius: 8, background: C.card, border: `0.5px solid ${C.rule}`,
          boxShadow: `0 8px 24px rgba(33,28,20,0.18)`,
          padding: 16, boxSizing: 'border-box',
          animation: `fan-${slot} 1.2s cubic-bezier(.4,0,.2,1) ${i * 0.04}s forwards`,
          ['--r']: `${(i - meals.length / 2) * 8}deg`,
        }}>
          <DishPlate meal={m} size={64} />
          <div style={{ fontFamily: C.fontDisplay, fontSize: 16, fontStyle: 'italic', color: C.ink, marginTop: 10, lineHeight: 1.1 }}>{m.name}</div>
        </div>
      ))}
    </div>
  );
}

function SlotShuffleOverlay({ plan, slot }) {
  const meals = MEALS.filter(m => m.type.includes(slot));
  const [tick, setTick] = React.useState(0);
  React.useEffect(() => {
    const t = setInterval(() => setTick(x => x + 1), 70);
    return () => clearInterval(t);
  }, []);
  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 5, pointerEvents: 'none', background: C.paper, padding: '8px 22px' }}>
      {plan.map((d, i) => {
        const m = meals[(tick + i * 3) % meals.length];
        return (
          <div key={i} style={{ display: 'flex', gap: 14, padding: '14px 0', borderTop: i === 0 ? 'none' : `0.5px solid ${C.ruleSoft}` }}>
            <div style={{ width: 38 }}>
              <div style={{ fontFamily: C.fontMono, fontSize: 10, letterSpacing: 1.4, color: C.inkFaint, textTransform: 'uppercase' }}>{d.day}</div>
            </div>
            <DishPlate meal={m} size={56} />
            <div style={{ flex: 1, opacity: 0.4 }}>
              <div style={{ fontFamily: C.fontDisplay, fontSize: 21, color: C.ink, fontStyle: 'italic' }}>{m.name}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function StaggerShuffleOverlay({ plan, slot }) {
  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 5, pointerEvents: 'none' }}>
      <style>{`@keyframes stagger-in { from { opacity: 0; transform: translateX(20px); } to { opacity: 1; transform: none; } }`}</style>
      {plan.map((d, i) => (
        <div key={i} style={{
          padding: '14px 22px', borderTop: i === 0 ? 'none' : `0.5px solid ${C.ruleSoft}`,
          background: C.paper, animation: `stagger-in 0.4s ${i * 0.08}s both`,
        }}>
          <div style={{ fontFamily: C.fontDisplay, fontSize: 21, color: C.inkFaint, fontStyle: 'italic' }}>—</div>
        </div>
      ))}
    </div>
  );
}

// ─── Bottom sheet ─────────────────────────────────────────────────────
function CookbookSheet({ sheet, plan, pantry, meals, favorites, neverAgain, onClose, onToggleEatOut, onSwap, setPantry, onAddCustomMeal, onRemoveMeal, onToggleFavorite, onToggleNeverAgain, onShuffle }) {
  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 100 }}>
      <div onClick={onClose} style={{ position: 'absolute', inset: 0, background: 'rgba(33,28,20,0.45)', backdropFilter: 'blur(2px)', animation: 'fade 0.2s' }} />
      <style>{`@keyframes fade { from { opacity: 0 } to { opacity: 1 } } @keyframes slideup { from { transform: translateY(100%) } to { transform: none } }`}</style>
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, maxHeight: '88%',
        background: C.paper, borderTopLeftRadius: 24, borderTopRightRadius: 24,
        animation: 'slideup 0.3s cubic-bezier(.2,.8,.2,1)',
        display: 'flex', flexDirection: 'column', overflow: 'hidden',
      }}>
        <div style={{ padding: '12px 0 6px', display: 'flex', justifyContent: 'center' }}>
          <div style={{ width: 36, height: 4, borderRadius: 2, background: C.rule }} />
        </div>
        <div style={{ overflow: 'auto', flex: 1, paddingBottom: 30 }}>
          {sheet.kind === 'meal' && <MealSheet plan={plan} sheet={sheet} onToggleEatOut={onToggleEatOut} onSwap={onSwap} onClose={onClose} />}
          {sheet.kind === 'pantry' && <PantrySheet pantry={pantry} setPantry={setPantry} onClose={onClose} onShuffle={onShuffle} />}
          {sheet.kind === 'shopping' && <ShoppingSheet plan={plan} pantry={pantry} setPantry={setPantry} onClose={onClose} />}
          {sheet.kind === 'meals' && <MealsLibrarySheet meals={meals} favorites={favorites} neverAgain={neverAgain} onAddCustomMeal={onAddCustomMeal} onRemoveMeal={onRemoveMeal} onToggleFavorite={onToggleFavorite} onToggleNeverAgain={onToggleNeverAgain} />}
        </div>
      </div>
    </div>
  );
}

function MealSheet({ plan, sheet, onToggleEatOut, onSwap, onClose }) {
  const day = plan[sheet.dayIdx];
  const meal = day[sheet.slot];
  const recipe = RECIPES[meal.id] || [];
  return (
    <div style={{ padding: '6px 22px 0' }}>
      <div style={{ fontFamily: C.fontMono, fontSize: 10, letterSpacing: 1.4, color: C.inkFaint, textTransform: 'uppercase' }}>{day.dayLong} · {sheet.slot}</div>
      <div style={{ fontFamily: C.fontDisplay, fontSize: 38, lineHeight: 1, marginTop: 6, color: C.ink }}>{meal.name}</div>
      <div style={{ fontFamily: C.fontBody, fontSize: 13, color: C.inkDim, marginTop: 6 }}>{meal.sub}</div>
      <div style={{ display: 'flex', justifyContent: 'center', margin: '24px 0 18px' }}>
        <DishPlate meal={meal} size={140} />
      </div>
      <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginBottom: 24 }}>
        <CTag>{meal.time} min</CTag>
        <CTag>{meal.kcal} kcal</CTag>
        {meal.tags.map(t => <CTag key={t}>{t}</CTag>)}
      </div>
      <div style={{ display: 'flex', gap: 10, marginBottom: 26 }}>
        <button onClick={() => { onSwap(sheet.dayIdx, sheet.slot); }} style={sheetBtn(C, false)}>↻ Swap meal</button>
        <button onClick={() => { onToggleEatOut(sheet.dayIdx); onClose(); }} style={sheetBtn(C, day.eatingOut)}>{day.eatingOut ? '✓ Eating in' : 'Eating out'}</button>
      </div>
      <div style={{ borderTop: `0.5px solid ${C.rule}`, paddingTop: 20 }}>
        <div style={{ fontFamily: C.fontMono, fontSize: 10, letterSpacing: 1.4, color: C.inkFaint, textTransform: 'uppercase', marginBottom: 12 }}>Ingredients</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 24 }}>
          {meal.pantry.map(k => <CTag key={k}>{pretty(k)}</CTag>)}
        </div>
        <div style={{ fontFamily: C.fontMono, fontSize: 10, letterSpacing: 1.4, color: C.inkFaint, textTransform: 'uppercase', marginBottom: 12 }}>How to make it</div>
        <ol style={{ padding: 0, margin: 0, listStyle: 'none' }}>
          {recipe.map((step, i) => (
            <li key={i} style={{ display: 'flex', gap: 14, padding: '10px 0', borderTop: i === 0 ? 'none' : `0.5px solid ${C.ruleSoft}` }}>
              <div style={{ fontFamily: C.fontDisplay, fontSize: 22, color: C.accent, fontStyle: 'italic', lineHeight: 1, width: 26 }}>{i + 1}</div>
              <div style={{ fontFamily: C.fontBody, fontSize: 14, color: C.ink, lineHeight: 1.45 }}>{step}</div>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

function sheetBtn(c, primary) {
  return {
    flex: 1, height: 44, borderRadius: 22,
    border: primary ? 'none' : `0.5px solid ${c.rule}`,
    background: primary ? c.accent : 'transparent',
    color: primary ? c.paper : c.ink,
    fontFamily: c.fontBody, fontSize: 14, cursor: 'pointer',
  };
}

function PantrySheet({ pantry, setPantry, onClose, onShuffle }) {
  const SECTIONS = [
    { label: 'Grains',     key: 'Grains & Starches' },
    { label: 'Protein',    key: 'Legumes & Protein' },
    { label: 'Vegetables', key: 'Vegetables' },
    { label: 'Spices',     key: 'Spices & Pantry' },
  ];
  const [mode, setMode] = React.useState('list');
  const [paste, setPaste] = React.useState('');
  const toggle = (k) => setPantry(p => {
    const n = new Set(p);
    n.has(k) ? n.delete(k) : n.add(k);
    return n;
  });
  const importPaste = () => {
    const lines = paste.toLowerCase().split(/[,\n]/).map(s => s.trim()).filter(Boolean);
    const all = Object.values(PANTRY_MASTER).flat();
    const found = new Set(pantry);
    for (const ln of lines) {
      const m = all.find(k => ln.includes(k.replace(/_/g, ' ')) || ln.includes(k));
      if (m) found.add(m);
    }
    setPantry(found);
    setMode('list');
  };
  const handleApply = () => { if (onShuffle) onShuffle(); onClose(); };
  return (
    <div style={{ padding: '6px 22px 0' }}>
      <div style={{ fontFamily: C.fontMono, fontSize: 10, letterSpacing: 1.4, color: C.inkFaint, textTransform: 'uppercase' }}>Your kitchen</div>
      <div style={{ fontFamily: C.fontDisplay, fontSize: 38, lineHeight: 1, marginTop: 6 }}>What's in the pantry</div>
      <div style={{ display: 'flex', gap: 4, padding: '20px 0 16px', borderBottom: `0.5px solid ${C.rule}` }}>
        {[['list','Tick from list'],['paste','Paste a receipt']].map(([k, label]) => (
          <button key={k} onClick={() => setMode(k)} style={{
            padding: '6px 12px', fontFamily: C.fontBody, fontSize: 12,
            background: mode === k ? C.ink : 'transparent', color: mode === k ? C.paper : C.inkDim,
            border: `0.5px solid ${mode === k ? C.ink : C.rule}`, borderRadius: 99, cursor: 'pointer',
          }}>{label}</button>
        ))}
      </div>
      {mode === 'list' && SECTIONS.map(({ label, key }) => {
        const items = PANTRY_MASTER[key] || [];
        return (
          <div key={label} style={{ paddingTop: 18 }}>
            <div style={{ fontFamily: C.fontBody, fontSize: 13, color: C.ink, fontWeight: 600, marginBottom: 10 }}>{label}</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {items.map(k => {
                const on = pantry.has(k);
                return (
                  <button key={k} onClick={() => toggle(k)} style={{
                    padding: '7px 11px', fontFamily: C.fontBody, fontSize: 12.5,
                    background: on ? C.accent : 'transparent',
                    color: on ? C.paper : C.ink,
                    border: `0.5px solid ${on ? C.accent : C.rule}`, borderRadius: 99, cursor: 'pointer',
                  }}>{on && '✓ '}{pretty(k)}</button>
                );
              })}
            </div>
          </div>
        );
      })}
      {mode === 'paste' && (
        <div style={{ paddingTop: 20 }}>
          <div style={{ fontFamily: C.fontBody, fontSize: 13, color: C.inkDim, lineHeight: 1.5, marginBottom: 12 }}>Paste your receipt or grocery list. We'll try to match items.</div>
          <textarea value={paste} onChange={e => setPaste(e.target.value)} placeholder="rice 5lb, chickpeas, paneer 200g..." style={{
            width: '100%', minHeight: 160, padding: 14, boxSizing: 'border-box',
            fontFamily: C.fontMono, fontSize: 12, color: C.ink, background: C.card,
            border: `0.5px solid ${C.rule}`, borderRadius: 8, resize: 'none', outline: 'none',
          }} />
          <button onClick={importPaste} style={{ ...sheetBtn(C, true), width: '100%', marginTop: 14 }}>Match {paste.split(/[,\n]/).filter(s => s.trim()).length || 0} items</button>
        </div>
      )}
      <div style={{ display: 'flex', gap: 8, padding: '24px 0 40px' }}>
        <button onClick={onClose} style={sheetBtn(C, false)}>Exit</button>
        <button onClick={handleApply} style={sheetBtn(C, true)}>Apply &amp; shuffle</button>
      </div>
    </div>
  );
}

function ShoppingSheet({ plan, pantry, setPantry, onClose }) {
  const AISLE_MAP = {
    'Legumes & Protein': 'Protein',
    'Vegetables': 'Vegetables',
    'Grains & Starches': 'Grains',
    'Dairy & Cold': 'Dairy',
    'Fruits': 'Fruits',
  };
  const AISLE_ORDER = ['Protein', 'Vegetables', 'Grains', 'Dairy', 'Fruits'];
  const rawList = buildShoppingList(plan, pantry);
  const list = {};
  for (const [aisle, items] of Object.entries(rawList)) {
    const display = AISLE_MAP[aisle];
    if (!display) continue;
    list[display] = [...(list[display] || []), ...items];
  }
  const orderedList = AISLE_ORDER.filter(a => list[a]).map(a => [a, list[a]]);
  const total = orderedList.reduce((n, [, items]) => n + items.length, 0);
  const [bought, setBought] = React.useState(new Set());
  const toggle = (k) => setBought(b => { const n = new Set(b); n.has(k) ? n.delete(k) : n.add(k); return n; });
  return (
    <div style={{ padding: '6px 22px 0' }}>
      <div style={{ fontFamily: C.fontMono, fontSize: 10, letterSpacing: 1.4, color: C.inkFaint, textTransform: 'uppercase' }}>To buy this week</div>
      <div style={{ fontFamily: C.fontDisplay, fontSize: 38, lineHeight: 1, marginTop: 6 }}>Shopping list</div>
      <div style={{ fontFamily: C.fontBody, fontSize: 13, color: C.inkDim, marginTop: 8 }}>{total} items to buy this week</div>
      <div style={{ paddingTop: 22, paddingBottom: 20 }}>
        {orderedList.map(([aisle, items]) => (
          <div key={aisle} style={{ marginBottom: 22 }}>
            <div style={{ fontFamily: C.fontBody, fontSize: 13, color: C.ink, fontWeight: 600, marginBottom: 10 }}>{aisle}</div>
            {items.map(it => {
              const done = bought.has(it.key);
              return (
                <div key={it.key} onClick={() => toggle(it.key)} style={{
                  display: 'flex', alignItems: 'center', gap: 12, padding: '11px 0',
                  borderTop: `0.5px solid ${C.ruleSoft}`, cursor: 'pointer',
                }}>
                  <div style={{
                    width: 18, height: 18, borderRadius: 9, border: `1px solid ${done ? C.accent : C.rule}`,
                    background: done ? C.accent : 'transparent',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  }}>{done && <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke={C.paper} strokeWidth="1.6"><path d="M2 5l2 2 4-4"/></svg>}</div>
                  <div style={{ flex: 1, fontFamily: C.fontBody, fontSize: 15, color: done ? C.inkFaint : C.ink, textDecoration: done ? 'line-through' : 'none' }}>{it.label}</div>
                  <div style={{ fontFamily: C.fontMono, fontSize: 10, letterSpacing: 1, color: C.inkFaint }}>{it.count}×</div>
                </div>
              );
            })}
          </div>
        ))}
      </div>
      <div style={{ position: 'sticky', bottom: 0, display: 'flex', justifyContent: 'flex-end', padding: '12px 0 28px', background: `linear-gradient(transparent, ${C.paper} 35%)` }}>
        <button onClick={onClose} style={{
          height: 46, padding: '0 28px', borderRadius: 23, border: 'none',
          background: C.ink, color: C.paper, fontFamily: C.fontBody, fontSize: 15,
          fontWeight: 500, cursor: 'pointer',
        }}>Apply</button>
      </div>
    </div>
  );
}

// ─── Meal library sheet ──────────────────────────────────────────────
// Three-tab sheet: All · Favorites · Never again. Each meal card has heart
// + ban toggles. "+ Add your own meal" opens an inline form (name, type,
// ingredients). Custom meals get a delete affordance.
function MealsLibrarySheet({ meals, favorites, neverAgain, onAddCustomMeal, onRemoveMeal, onToggleFavorite, onToggleNeverAgain }) {
  const [tab, setTab] = React.useState('all'); // all | fav | never
  const [adding, setAdding] = React.useState(false);
  const [form, setForm] = React.useState({ name: '', type: 'lunch', ingredients: '' });

  const filtered = meals.filter(m => {
    if (tab === 'fav') return favorites.has(m.id);
    if (tab === 'never') return neverAgain.has(m.id);
    return true;
  });
  const lunchCount = meals.filter(m => m.type.includes('lunch') && !neverAgain.has(m.id)).length;
  const dinnerCount = meals.filter(m => m.type.includes('dinner') && !neverAgain.has(m.id)).length;

  const submit = () => {
    if (!form.name.trim() || !form.ingredients.trim()) return;
    onAddCustomMeal(form);
    setForm({ name: '', type: 'lunch', ingredients: '' });
    setAdding(false);
  };

  return (
    <div style={{ padding: '6px 22px 0' }}>
      <div style={{ fontFamily: C.fontMono, fontSize: 10, letterSpacing: 1.4, color: C.inkFaint, textTransform: 'uppercase' }}>The collection</div>
      <div style={{ fontFamily: C.fontDisplay, fontSize: 38, lineHeight: 1, marginTop: 6 }}>Your meals</div>
      <div style={{ fontFamily: C.fontBody, fontSize: 13, color: C.inkDim, marginTop: 8 }}>
        {lunchCount} lunches · {dinnerCount} dinners in rotation
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 4, padding: '20px 0 16px', borderBottom: `0.5px solid ${C.rule}` }}>
        {[['all', `All · ${meals.length}`], ['fav', `♥ Favorites · ${favorites.size}`], ['never', `Never · ${neverAgain.size}`]].map(([k, label]) => (
          <button key={k} onClick={() => setTab(k)} style={{
            padding: '6px 12px', fontFamily: C.fontBody, fontSize: 12,
            background: tab === k ? C.ink : 'transparent', color: tab === k ? C.paper : C.inkDim,
            border: `0.5px solid ${tab === k ? C.ink : C.rule}`, borderRadius: 99, cursor: 'pointer',
          }}>{label}</button>
        ))}
      </div>

      {/* + Add custom meal */}
      {!adding && tab === 'all' && (
        <button onClick={() => setAdding(true)} style={{
          width: '100%', marginTop: 16, padding: '14px 16px',
          background: C.card, border: `0.5px dashed ${C.rule}`, borderRadius: 10,
          fontFamily: C.fontBody, fontSize: 14, color: C.ink, cursor: 'pointer',
          display: 'flex', alignItems: 'center', gap: 10, justifyContent: 'center',
        }}>
          <span style={{ fontFamily: C.fontDisplay, fontSize: 22, fontStyle: 'italic', color: C.accent, lineHeight: 1 }}>+</span>
          Add your own meal
        </button>
      )}

      {adding && (
        <div style={{ marginTop: 16, padding: 16, background: C.card, border: `0.5px solid ${C.rule}`, borderRadius: 10 }}>
          <div style={{ fontFamily: C.fontMono, fontSize: 9.5, letterSpacing: 1.4, color: C.inkFaint, textTransform: 'uppercase', marginBottom: 6 }}>Meal name</div>
          <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g. Cucumber Mint Smoothie" style={inputStyle()} />

          <div style={{ fontFamily: C.fontMono, fontSize: 9.5, letterSpacing: 1.4, color: C.inkFaint, textTransform: 'uppercase', marginBottom: 6, marginTop: 12 }}>Type</div>
          <div style={{ display: 'flex', gap: 6 }}>
            {[['lunch','Lunch'],['dinner','Dinner'],['both','Both']].map(([k, label]) => (
              <button key={k} onClick={() => setForm({ ...form, type: k })} style={{
                flex: 1, padding: '9px 0', fontFamily: C.fontBody, fontSize: 13,
                background: form.type === k ? C.ink : 'transparent', color: form.type === k ? C.paper : C.ink,
                border: `0.5px solid ${form.type === k ? C.ink : C.rule}`, borderRadius: 99, cursor: 'pointer',
              }}>{label}</button>
            ))}
          </div>

          <div style={{ fontFamily: C.fontMono, fontSize: 9.5, letterSpacing: 1.4, color: C.inkFaint, textTransform: 'uppercase', marginBottom: 6, marginTop: 12 }}>Ingredients (comma-sep)</div>
          <textarea value={form.ingredients} onChange={e => setForm({ ...form, ingredients: e.target.value })} placeholder="banana, oats, almond butter, milk" style={{ ...inputStyle(), minHeight: 64, resize: 'none', fontFamily: C.fontMono, fontSize: 12 }} />

          <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
            <button onClick={() => { setAdding(false); setForm({ name: '', type: 'lunch', ingredients: '' }); }} style={sheetBtn(C, false)}>Cancel</button>
            <button onClick={submit} style={{ ...sheetBtn(C, true), opacity: form.name.trim() && form.ingredients.trim() ? 1 : 0.45 }}>Save meal</button>
          </div>
        </div>
      )}

      {/* Meal grid */}
      <div style={{ paddingTop: 18, paddingBottom: 8 }}>
        {filtered.length === 0 && (
          <div style={{ fontFamily: C.fontBody, fontSize: 14, color: C.inkFaint, padding: '24px 0', textAlign: 'center' }}>
            {tab === 'fav' ? 'No favorites yet — tap ♥ on any meal.' :
             tab === 'never' ? 'Nothing banned. Anything you don\'t like, ban it from the rotation.' :
             'No meals.'}
          </div>
        )}
        {filtered.map(m => {
          const fav = favorites.has(m.id);
          const ban = neverAgain.has(m.id);
          return (
            <div key={m.id} style={{
              display: 'flex', gap: 14, padding: '14px 0',
              borderTop: `0.5px solid ${C.ruleSoft}`, alignItems: 'center',
              opacity: ban ? 0.55 : 1,
            }}>
              <DishPlate meal={m} size={56} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                  <div style={{ fontFamily: C.fontDisplay, fontSize: 19, color: C.ink, fontStyle: 'italic', lineHeight: 1.1, textDecoration: ban ? 'line-through' : 'none' }}>{m.name}</div>
                  {m.custom && <span style={{ fontFamily: C.fontMono, fontSize: 8.5, letterSpacing: 1, color: C.accent, textTransform: 'uppercase' }}>own</span>}
                </div>
                <div style={{ fontFamily: C.fontBody, fontSize: 12, color: C.inkDim, marginTop: 2 }}>
                  {m.type.join(' · ')} · {m.sub}
                </div>
              </div>
              <button onClick={() => onToggleFavorite(m.id)} style={iconChip(C, fav)} title="Favorite">
                <svg width="14" height="14" viewBox="0 0 14 14" fill={fav ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.4"><path d="M7 12s-4.5-2.7-4.5-6.2A2.8 2.8 0 017 4a2.8 2.8 0 014.5 1.8C11.5 9.3 7 12 7 12z"/></svg>
              </button>
              <button onClick={() => onToggleNeverAgain(m.id)} style={iconChip(C, ban)} title="Never again">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.4"><circle cx="7" cy="7" r="5"/><path d="M3.5 3.5l7 7"/></svg>
              </button>
              {m.custom && (
                <button onClick={() => onRemoveMeal(m.id)} style={iconChip(C, false)} title="Delete custom meal">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.4"><path d="M3 4.5h8M5 4.5V3a1 1 0 011-1h2a1 1 0 011 1v1.5M4 4.5l.5 7h5l.5-7"/></svg>
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function inputStyle() {
  return {
    width: '100%', boxSizing: 'border-box', padding: '11px 14px',
    fontFamily: C.fontBody, fontSize: 14, color: C.ink, background: C.paper,
    border: `0.5px solid ${C.rule}`, borderRadius: 8, outline: 'none',
  };
}

function iconChip(c, on) {
  return {
    width: 32, height: 32, borderRadius: 16, border: `0.5px solid ${on ? c.accent : c.rule}`,
    background: on ? c.accent : 'transparent',
    color: on ? c.paper : c.inkDim, cursor: 'pointer', flexShrink: 0,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  };
}

window.CookbookApp = CookbookApp;
