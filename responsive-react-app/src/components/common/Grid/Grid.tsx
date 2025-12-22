import React from 'react';
import './Grid.css';

interface GridProps {
  children: React.ReactNode;
  columns?: number; // Number of columns, e.g., 12
  gap?: string; // Gap between grid items, e.g., '10px', '1rem'
}

const Grid: React.FC<GridProps> = ({ children, columns = 12, gap = '1rem' }) => {
  const gridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: `repeat(${columns}, 1fr)`,
    gap: gap,
  };

  return (
    <div className="grid-container" style={gridStyle}>
      {children}
    </div>
  );
};

interface GridItemProps {
  children: React.ReactNode;
  span?: number; // How many columns the item should span
}

const GridItem: React.FC<GridItemProps> = ({ children, span }) => {
  const itemStyle: React.CSSProperties = {};
  if (span) {
    itemStyle.gridColumn = `span ${span}`;
  }
  return (
    <div className="grid-item" style={itemStyle}>
      {children}
    </div>
  );
};

export { Grid, GridItem };
