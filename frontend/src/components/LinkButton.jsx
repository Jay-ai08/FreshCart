export default function LinkButton({ to, children, className = '', onNavigate, ...props }) {
  function handleClick(event) {
    event.preventDefault();
    onNavigate(to);
  }

  return (
    <a href={to} className={className} onClick={handleClick} {...props}>
      {children}
    </a>
  );
}
