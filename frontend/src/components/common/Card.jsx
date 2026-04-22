import PropTypes from 'prop-types';

function Card({
  children,
  className = '',
  hover = false,
  shadow = 'md',
  ...props
}) {
  const baseClasses = 'bg-white rounded-lg border border-gray-200 overflow-hidden';

  const shadowClasses = {
    none: '',
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg',
    xl: 'shadow-xl'
  };

  const hoverClasses = hover ? 'hover:shadow-lg' : '';

  const classes = `${baseClasses} ${shadowClasses[shadow]} ${hoverClasses} ${className}`;

  return (
    <div className={classes} {...props}>
      {children}
    </div>
  );
}

Card.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  hover: PropTypes.bool,
  shadow: PropTypes.oneOf(['none', 'sm', 'md', 'lg', 'xl'])
};

export default Card;