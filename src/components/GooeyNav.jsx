import React, { useRef, useEffect, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import './GooeyNav.css';

const GooeyNav = ({
  items = [],
  animationTime = 600,
  particleCount = 15,
  particleDistances = [90, 10],
  particleR = 100,
  timeVariance = 300,
  colors = [1, 2, 3, 1, 2, 3, 1, 4],
  initialActiveIndex = 0,
  activeIndex: externalActiveIndex,
  activeTab,
  onSelect
}) => {
  const containerRef = useRef(null);
  const navRef = useRef(null);
  const filterRef = useRef(null);
  const textRef = useRef(null);
  const [internalActiveIndex, setInternalActiveIndex] = useState(initialActiveIndex);
  const [openDropdownIndex, setOpenDropdownIndex] = useState(null);

  const activeIndex = externalActiveIndex !== undefined ? externalActiveIndex : internalActiveIndex;

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpenDropdownIndex(null);
      }
    };
    document.addEventListener('click', handleOutsideClick);
    return () => document.removeEventListener('click', handleOutsideClick);
  }, []);

  const noise = (n = 1) => n / 2 - Math.random() * n;

  const getXY = (distance, pointIndex, totalPoints) => {
    const angle = ((360 + noise(8)) / totalPoints) * pointIndex * (Math.PI / 180);
    return [distance * Math.cos(angle), distance * Math.sin(angle)];
  };

  const createParticle = (i, t, d, r) => {
    let rotate = noise(r / 10);
    return {
      start: getXY(d[0], particleCount - i, particleCount),
      end: getXY(d[1] + noise(7), particleCount - i, particleCount),
      time: t,
      scale: 1 + noise(0.2),
      color: colors[Math.floor(Math.random() * colors.length)],
      rotate: rotate > 0 ? (rotate + r / 20) * 10 : (rotate - r / 20) * 10
    };
  };

  const makeParticles = element => {
    if (!element) return;
    const d = particleDistances;
    const r = particleR;
    const bubbleTime = animationTime * 2 + timeVariance;
    element.style.setProperty('--time', `${bubbleTime}ms`);

    for (let i = 0; i < particleCount; i++) {
      const t = animationTime * 2 + noise(timeVariance * 2);
      const p = createParticle(i, t, d, r);
      element.classList.remove('active');

      setTimeout(() => {
        const particle = document.createElement('span');
        const point = document.createElement('span');
        particle.classList.add('particle');
        particle.style.setProperty('--start-x', `${p.start[0]}px`);
        particle.style.setProperty('--start-y', `${p.start[1]}px`);
        particle.style.setProperty('--end-x', `${p.end[0]}px`);
        particle.style.setProperty('--end-y', `${p.end[1]}px`);
        particle.style.setProperty('--time', `${p.time}ms`);
        particle.style.setProperty('--scale', `${p.scale}`);
        particle.style.setProperty('--color', `var(--color-${p.color}, white)`);
        particle.style.setProperty('--rotate', `${p.rotate}deg`);

        point.classList.add('point');
        particle.appendChild(point);
        element.appendChild(particle);
        requestAnimationFrame(() => {
          element.classList.add('active');
        });
        setTimeout(() => {
          try {
            if (element.contains(particle)) {
              element.removeChild(particle);
            }
          } catch {
            // Do nothing
          }
        }, t);
      }, 30);
    }
  };

  const updateEffectPosition = element => {
    if (!containerRef.current || !filterRef.current || !textRef.current || !element) return;
    const containerRect = containerRef.current.getBoundingClientRect();
    const pos = element.getBoundingClientRect();

    const styles = {
      left: `${pos.x - containerRect.x}px`,
      top: `${pos.y - containerRect.y}px`,
      width: `${pos.width}px`,
      height: `${pos.height}px`
    };
    Object.assign(filterRef.current.style, styles);
    Object.assign(textRef.current.style, styles);

    const anchorEl = element.tagName === 'A' ? element : element.querySelector('a') || element;
    textRef.current.innerHTML = anchorEl.innerHTML;
  };

  const handleClick = (e, index, item) => {
    const target = e.currentTarget;
    const liEl = target.tagName === 'LI' ? target : target.closest('li') || target;
    
    if (activeIndex === index) return;

    setInternalActiveIndex(index);
    if (onSelect) onSelect(index, item);
    if (item?.onClick) item.onClick();

    updateEffectPosition(liEl);

    if (filterRef.current) {
      const particles = filterRef.current.querySelectorAll('.particle');
      particles.forEach(p => {
        try { filterRef.current.removeChild(p); } catch {}
      });
    }

    if (textRef.current) {
      textRef.current.classList.remove('active');
      void textRef.current.offsetWidth;
      textRef.current.classList.add('active');
    }

    if (filterRef.current) {
      makeParticles(filterRef.current);
    }
  };

  const handleKeyDown = (e, index, item) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      const target = e.currentTarget;
      const liEl = target.tagName === 'LI' ? target : target.closest('li') || target;
      handleClick({ currentTarget: liEl }, index, item);
    }
  };

  useEffect(() => {
    if (!navRef.current || !containerRef.current) return;
    const activeLi = navRef.current.querySelectorAll('li')[activeIndex];
    if (activeLi) {
      updateEffectPosition(activeLi);
      textRef.current?.classList.add('active');
    }

    const resizeObserver = new ResizeObserver(() => {
      const currentActiveLi = navRef.current?.querySelectorAll('li')[activeIndex];
      if (currentActiveLi) {
        updateEffectPosition(currentActiveLi);
      }
    });

    resizeObserver.observe(containerRef.current);
    return () => resizeObserver.disconnect();
  }, [activeIndex]);

  return (
    <div className="gooey-nav-container" ref={containerRef}>
      <nav>
        <ul ref={navRef}>
          {items.map((item, index) => {
            const hasChildren = item.children && item.children.length > 0;
            const isOpen = openDropdownIndex === index;
            return (
              <li 
                key={index} 
                className={`${activeIndex === index ? 'active' : ''} ${hasChildren ? 'has-dropdown' : ''}`}
                onMouseEnter={() => hasChildren && setOpenDropdownIndex(index)}
                onMouseLeave={() => hasChildren && setOpenDropdownIndex(null)}
              >
                <a
                  href={item.href || '#'}
                  onClick={e => {
                    e.preventDefault();
                    if (hasChildren) {
                      setOpenDropdownIndex(prev => prev === index ? null : index);
                    }
                    handleClick(e, index, item);
                  }}
                  onKeyDown={e => handleKeyDown(e, index, item)}
                >
                  {item.icon && <span className="nav-icon" style={{ marginRight: '6px', display: 'inline-flex', alignItems: 'center' }}>{item.icon}</span>}
                  {item.label}
                  {hasChildren && (
                    <ChevronDown 
                      size={13} 
                      style={{ 
                        marginLeft: '4px', 
                        opacity: 0.85, 
                        display: 'inline-block', 
                        verticalAlign: 'middle',
                        transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                        transition: 'transform 0.2s ease'
                      }} 
                    />
                  )}
                </a>
                {hasChildren && (
                  <div className={`gooey-nav-dropdown ${isOpen ? 'open' : ''}`}>
                    {item.children.map((child, cIdx) => (
                      <div
                        key={cIdx}
                        className={`gooey-nav-dropdown-item ${child.id && child.id === activeTab ? 'active' : ''}`}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          if (child.onClick) child.onClick();
                          setOpenDropdownIndex(null);
                          const activeLi = navRef.current?.querySelectorAll('li')[index];
                          if (activeLi) {
                            handleClick({ currentTarget: activeLi }, index, item);
                          }
                        }}
                      >
                        {child.icon && <span className="item-icon">{child.icon}</span>}
                        <span>{child.label}</span>
                      </div>
                    ))}
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </nav>
      <span className="effect filter" ref={filterRef} />
      <span className="effect text" ref={textRef} />
    </div>
  );
};

export default GooeyNav;

