const projectTabs = document.querySelectorAll('.projects-tab');
const projectTracks = document.querySelectorAll('.projects-track');
const sliderArrows = document.querySelectorAll('.slider-arrow');

function activeTrack() {
	return document.querySelector('.projects-track:not(.is-hidden)');
}

function updateSliderState() {
	const track = activeTrack();
	if (!track) return;

	const atStart = track.scrollLeft <= 1;
	const atEnd = track.scrollLeft + track.clientWidth >= track.scrollWidth - 1;
	document.querySelector('[data-direction="prev"]').disabled = atStart;
	document.querySelector('[data-direction="next"]').disabled = atEnd;
}

projectTabs.forEach((tab) => {
	tab.addEventListener('click', () => {
		const selectedView = tab.dataset.view;

		projectTabs.forEach((item) => {
			const isSelected = item === tab;
			item.classList.toggle('active', isSelected);
			item.setAttribute('aria-selected', String(isSelected));
		});

		projectTracks.forEach((track) => {
			const isSelected = track.dataset.track === selectedView;
			track.classList.toggle('is-hidden', !isSelected);
			track.setAttribute('aria-hidden', String(!isSelected));
		});

		updateSliderState();
	});
});

sliderArrows.forEach((arrow) => {
	arrow.addEventListener('click', () => {
		const track = activeTrack();
		const distance = Math.max(track.clientWidth * 0.82, 280);
		const direction = arrow.dataset.direction === 'next' ? 1 : -1;
		track.scrollBy({ left: direction * distance, behavior: 'smooth' });
	});
});

projectTracks.forEach((track) => track.addEventListener('scroll', updateSliderState));
window.addEventListener('resize', updateSliderState);
updateSliderState();

// Keep the navigation highlight aligned with the section being read.
const navigationLinks = document.querySelectorAll('.sidebar .nav-link');
const sectionObserver = new IntersectionObserver((entries) => {
	entries.forEach((entry) => {
		if (!entry.isIntersecting) return;
		navigationLinks.forEach((link) => {
			const isCurrent = link.getAttribute('href') === `#${entry.target.id}`;
			link.classList.toggle('active', isCurrent);
			if (isCurrent) link.setAttribute('aria-current', 'location');
			else link.removeAttribute('aria-current');
		});
	});
}, { rootMargin: '-10% 0px -45% 0px' });

document.querySelectorAll('main > .section').forEach((section) => sectionObserver.observe(section));
