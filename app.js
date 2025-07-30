const video = document.getElementById('video');
const shakaPlayer = new shaka.Player(video);
let hls;

shaka.polyfill.installAll();

if (!shaka.Player.isBrowserSupported()) {
  alert('Browser tidak mendukung Shaka Player.');
}

function loadChannel(url) {
  video.setAttribute('controls', 'true'); // Tampilkan kontrol setelah channel diklik

  if (url.endsWith('.mpd')) {
    if (hls) {
      hls.destroy();
      hls = null;
    }
    shakaPlayer.load(url)
      .then(() => video.removeAttribute('poster'))
      .catch(e => console.error('Shaka load error:', e));
  } else if (url.endsWith('.m3u8')) {
    if (shakaPlayer) {
      shakaPlayer.unload();
    }
    if (Hls.isSupported()) {
      if (hls) hls.destroy();
      hls = new Hls();
      hls.loadSource(url);
      hls.attachMedia(video);
      video.removeAttribute('poster');
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = url;
      video.removeAttribute('poster');
    } else {
      alert('HLS tidak didukung di browser ini.');
    }
  } else {
    alert('Format video tidak didukung.');
  }
}

// Ambil channel dari JSON
fetch('channels.json')
  .then(res => res.json())
  .then(data => {
    const container = document.getElementById('channel-list');
    data.channels.forEach(ch => {
      const card = document.createElement('button');
      card.className = 'bg-gray-800 p-4 rounded shadow hover:bg-gray-700 transition';
      card.innerHTML = `
        <div class="font-semibold">${ch.title}</div>
        <div class="text-sm text-gray-400">${ch.time}</div>
      `;
      card.onclick = () => loadChannel(ch.url);
      container.appendChild(card);
    });
  });

// Tombol kualitas manual (placeholder)
document.querySelectorAll('.quality-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    alert(`Pengaturan kualitas: ${btn.dataset.res} (belum diaktifkan)`);
  });
});
