console.log('🌙 Dark Mode Activated!');

const darkStyle = document.createElement('style');
darkStyle.innerText = `
  body { background-color: #181818 !important; color: white !important; }
  ytd-app { background-color: #181818 !important; }
`;
document.head.appendChild(darkStyle);
