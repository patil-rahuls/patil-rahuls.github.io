
const container = document.getElementById('masonry');
function layoutMasonry() {
  const containerWidth = container.clientWidth;
  let colCount = 3;
  if (containerWidth < 600) colCount = 1;
  else if (containerWidth < 900) colCount = 2;
  const colWidth = containerWidth / colCount;
  const colHeights = Array(colCount).fill(0);
  container.innerHTML = '';
  container.style.position = 'relative';
  myPhotos.forEach((img, i) => {
    const ratio = img.h / img.w;
    const height = colWidth * ratio;
    // find shortest column
    const col = colHeights.indexOf(Math.min(...colHeights));
    const top = colHeights[col];
    const left = col * colWidth;
    colHeights[col] += height + 14; // add gap
    const card = document.createElement('figure');
    card.className = 'card';
    card.style.top = top + 'px';
    card.style.left = left + 'px';
    card.style.width = (colWidth - 14) + 'px';
    card.style.height = height + 'px';
    const skeleton = document.createElement('div');
    skeleton.className = 'skeleton';
    card.appendChild(skeleton);
    const image = document.createElement('img');
    image.setAttribute('loading', 'lazy');
    image.src = img.src;
    image.addEventListener('load', () => {
      card.classList.add('loaded');
    });
    card.appendChild(image);
    container.appendChild(card);
  });
  container.style.height = Math.max(...colHeights) + 'px';
}
window.addEventListener('resize', layoutMasonry);
window.addEventListener('load', layoutMasonry);