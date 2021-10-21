<script>
	export let name;
	import Content from './Content.svelte';
	import { onMount } from 'svelte';
	import Header from './Header.svelte';
	import FactItem from './FactItem.svelte';
	import Award from './Award.svelte';
	import Degreed from './Degreed.svelte';
	import Certification from './Certification.svelte';
  import Modal from 'svelte-simple-modal';
	import { query } from './stores.js';
	import { Tabs, Tab, TabList, TabPanel } from 'svelte-tabs';
	import ProgressBar from '@okrad/svelte-progressbar';

	let user = {};
	let aob = {};
	let series = [{
		perc: 0,
		color: '#2196f3'
	}];

	function getProfile(id) {
		fetch(`/employee/${id}`).then(res => res.json()).then(res => {
			user = res.Item;
			user.skillsFormat = user.skills.slice(0, -1).join(', ');
			user.toEmail = `mailto:${user.email}`;
			series = [{
				perc: user.profilescore,
				color: '#2196f3'
			}];
		});
	}

	function getAob(id) {
		fetch(`/aob/${id}`).then(res => res.json()).then(res => {
			aob = res.Item || {};
		});
	}

	const unsubscribe = query.subscribe(value => {
		getProfile(value);
		getAob(value);
	});

	onMount(async () => {
		getProfile('43304443');
		getAob('43304443');
	});

	// let slick0 = 'slick-active';
	// let slick1 = '';
	// let aob = [{
	// 	name: 'Alice',
	// 	title: 'BA',
	// 	message: 'I enjoy working with the theme and learn so much. You guys make the process fun and interesting. Good luck! 👍',
	// 	active: true
	// }, {
	// 	name: 'Seven',
	// 	title: '234',
	// 	message: '234'
	// }, {
	// 	name: 'Ritu',
	// 	title: '345',
	// 	message: '345'
	// }];

	// let activeContent = aob.filter(item => item.active)[0];
	//
	// const handleSlick = (id) => () => {
	// 	aob = aob.map(item => ({
	// 		name: item.name,
	// 		title: item.title,
	// 		message: item.message
	// 	}));
	//
	// 	aob[id].active = true;
	//
	// 	aob = [ ...aob ];
	// }

</script>

<Header />
<main class="content">
	<section id="about">

		<div class="container">

			<!-- section title -->
			<h2 class="section-title wow fadeInUp" style="visibility: visible; animation-name: fadeInUp;">About {user.firstName}</h2>

			<div class="spacer" data-height="60" style="height: 60px;"></div>

			<div class="row">

				<div class="col-md-3">
					<div class="text-center text-md-left" style="width: 150px;">
						<!-- avatar image -->
						<img src={user?.profilepic} alt="Bolby" style="
    width: 150px;
    border-radius: 50%;
    height: 150px;
">
						<div style="
						    text-align: center;
						    margin-top: 20px;
						    font-size: 18px;
						    font-weight: bold;
						">{user.firstName} {user.lastName}</div>
					</div>
					<div class="spacer d-md-none d-lg-none" data-height="30" style="height: 30px;"></div>
				</div>

				<div class="col-md-9 triangle-left-md triangle-top-sm">
					<div class="rounded bg-white shadow-dark">
						<div class="">
							<div class="" style="display: flex;">
								<!-- about text -->
								<div class="padding-30">
									<div>
										<p>I am {user.firstName} {user.lastName}, working as {user.designation} in {user.department} team.</p>
										<p>I have rich experience in {user.skillsFormat}, also I am good at {user?.skills?.slice(-1)}.</p>
									</div>
									<div style="
    display: flex;
    align-items: center;
    width: 600px;
    justify-content: space-between;
">
									<div>
										<span class="icon icon-location-pin"></span>
										{user.location}
									</div>
									<!-- <div>
										<a href="#" class="btn btn-default">Print Profile</a>
									</div> -->
									</div>
								</div>
								<div class="right-part" style="display: flex; flex-direction: column;">
									<ProgressBar style='radial' width={110} height={110} series={series} thickness={10} />
									<span style="
    margin-bottom: 10px;
">Profile Score</span>
								</div>
								<div class="spacer d-md-none d-lg-none" data-height="30" style="height: 30px;"></div>
							</div>
						</div>
					</div>
				</div>

			</div>
			<!-- row end -->

			<div class="spacer" data-height="70" style="height: 70px;"></div>

			<div class="row">

			  <div class="col-md-3 col-sm-6">
			    <!-- fact item -->
			    <div class="fact-item">
			      <span class="icon icon-trophy"></span>
			      <div class="details">
			        <h3 class="mb-0 mt-0 number">{user?.degreedResponse?.awards?.length || 0}</h3>
			        <p class="mb-0">Awards win</p>
			      </div>
			    </div>
			    <div class="spacer d-md-none d-lg-none" data-height="30" style="height: 30px;"></div>
			  </div>


			  <div class="col-md-3 col-sm-6">
			    <!-- fact item -->
			    <div class="fact-item">
			      <span class="icon icon-badge"></span>
			      <div class="details">
			        <h3 class="mb-0 mt-0 number">{user?.degreedResponse?.certifications?.length || 0}</h3>
			        <p class="mb-0">Centification gain</p>
			      </div>
			    </div>
			    <div class="spacer d-md-none d-lg-none" data-height="30" style="height: 30px;"></div>
			  </div>

			  <div class="col-md-3 col-sm-6">
			    <!-- fact item -->
			    <div class="fact-item">
			      <span class="icon icon-graduation"></span>
			      <div class="details">
			        <h3 class="mb-0 mt-0 number">{user?.degreedResponse?.degree?.length || 0}</h3>
			        <p class="mb-0">Degree completed</p>
			      </div>
			    </div>
			    <div class="spacer d-md-none d-lg-none" data-height="30" style="height: 30px;"></div>
			  </div>

			  <div class="col-md-3 col-sm-6">
			    <!-- fact item -->
			    <div class="fact-item">
			      <span class="icon icon-shield"></span>
			      <div class="details">
			        <h3 class="mb-0 mt-0 number">{user?.degreedResponse?.badges?.length || 0}</h3>
			        <p class="mb-0">Badges</p>
			      </div>
			    </div>
			  </div>

			</div>


		</div>

	</section>

	<!-- section services -->
	<section id="services">

		<div class="container">

			<!-- section title -->
			<h2 class="section-title wow fadeInUp" style="visibility: visible; animation-name: fadeInUp;">Services</h2>

			<div class="spacer" data-height="60" style="height: 60px;"></div>

			<div class="row">

				<Tabs initialSelectedIndex={-1}>
					<TabList>
						<Tab>
						<div>
							<!-- service box -->
							<div class="service-box rounded data-background padding-30 text-center text-light shadow-blue" data-color="#6C6CE5" style="background-color: rgb(108, 108, 229);">
								<img src="images/service-1.svg" alt="UI/UX design">
								<h3 class="mb-3 mt-0">Awards</h3>
								<p class="mb-0">Lorem ipsum dolor sit amet consectetuer adipiscing elit aenean commodo ligula eget.</p>
							</div>
							<div class="spacer d-md-none d-lg-none" data-height="30" style="height: 30px;"></div>
						</div>
						</Tab>
						<Tab>
						<div>
							<!-- service box -->
							<div class="service-box rounded data-background padding-30 text-center shadow-yellow" data-color="#F9D74C" style="background-color: rgb(249, 215, 76);">
								<img src="images/service-2.svg" alt="UI/UX design">
								<h3 class="mb-3 mt-0">Centification</h3>
								<p class="mb-0">Lorem ipsum dolor sit amet consectetuer adipiscing elit aenean commodo ligula eget.</p>
							</div>
							<div class="spacer d-md-none d-lg-none" data-height="30" style="height: 30px;"></div>
						</div>
						</Tab>
						<Tab>
						<div>
							<!-- service box -->
							<div class="service-box rounded data-background padding-30 text-center text-light shadow-pink" data-color="#F97B8B" style="background-color: rgb(249, 123, 139);">
								<img src="images/service-3.svg" alt="UI/UX design">
								<h3 class="mb-3 mt-0">Degrees</h3>
								<p class="mb-0">Lorem ipsum dolor sit amet consectetuer adipiscing elit aenean commodo ligula eget.</p>
							</div>
						</div>
						</Tab>
					</TabList>

					<TabPanel>
						<Award />
					</TabPanel>

					<TabPanel>
						<Certification />
					</TabPanel>

					<TabPanel>
						<Degreed />
					</TabPanel>
				</Tabs>
			</div>
		</div>

	</section>

	<!-- section testimonials -->
	<section id="testimonials">

		<div class="container">

			<!-- section title -->
			<h2 class="section-title wow fadeInUp" style="visibility: visible; animation-name: fadeInUp;">At Our Best</h2>

			<div class="spacer" data-height="60" style="height: 60px;"></div>

			<!-- testimonials wrapper -->
			{#if aob.nominatedBy}
			<div class="testimonials-wrapper slick-initialized slick-slider slick-dotted" role="toolbar">

				<!-- testimonial item -->
				<div aria-live="polite" class="slick-list draggable"><div class="slick-track" role="listbox" style="opacity: 1; width: 2800px; transform: translate3d(-700px, 0px, 0px);">
				<div class="testimonial-item text-center mx-auto slick-slide slick-cloned" data-slick-index="-1" aria-hidden="true" tabindex="-1" style="width: 700px;">
					<div class="thumb mb-3 mx-auto">
						<img src="images/avatar-1.svg" alt="customer-name">
					</div>
					<h4 class="mt-3 mb-0">Seven</h4>
					<span class="subtitle">Product designer at Dribbble</span>
					<div class="bg-white padding-30 shadow-dark rounded triangle-top position-relative mt-4">
						<p class="mb-0">I enjoy working with the theme and learn so much. You guys make the process fun and interesting. Good luck! 🔥</p>
					</div>
				</div>
				<div class="testimonial-item text-center mx-auto slick-slide slick-current slick-active" data-slick-index="0" aria-hidden="false" tabindex="-1" role="option" aria-describedby="slick-slide00" style="width: 700px;">
					<div class="thumb mb-3 mx-auto">
						<img src="images/avatar-3.svg" alt="customer-name">
					</div>
					<h4 class="mt-3 mb-0">{aob.nominatedBy}</h4>
					<span class="subtitle">{aob.behaviour}</span>
					<div class="bg-white padding-30 shadow-dark rounded triangle-top position-relative mt-4">
						<p class="mb-0">{aob.accoladeText}</p>
					</div>
				</div>
				<div class="testimonial-item text-center mx-auto slick-slide" data-slick-index="1" aria-hidden="true" tabindex="-1" role="option" aria-describedby="slick-slide01" style="width: 700px;">
					<div class="thumb mb-3 mx-auto">
						<img src="images/avatar-1.svg" alt="customer-name">
					</div>
					<h4 class="mt-3 mb-0">Ritu</h4>
					<span class="subtitle">Product designer at Dribbble</span>
					<div class="bg-white padding-30 shadow-dark rounded triangle-top position-relative mt-4">
						<p class="mb-0">I enjoy working with the theme and learn so much. You guys make the process fun and interesting. Good luck! 🔥</p>
					</div>
				</div>
				<div class="testimonial-item text-center mx-auto slick-slide slick-cloned" data-slick-index="2" aria-hidden="true" tabindex="-1" style="width: 700px;">
					<div class="thumb mb-3 mx-auto">
						<img src="images/avatar-3.svg" alt="customer-name">
					</div>
					<h4 class="mt-3 mb-0">Sunil</h4>
					<span class="subtitle">Product designer at Dribbble</span>
					<div class="bg-white padding-30 shadow-dark rounded triangle-top position-relative mt-4">
						<p class="mb-0">I enjoy working with the theme and learn so much. You guys make the process fun and interesting. Good luck! 👍</p>
					</div>
				</div>
				</div></div>

				<!-- testimonial item -->


			<!-- <ul class="slick-dots" style="display: block;" role="tablist">
				{#each aob as item, i}
					<li on:click={handleSlick(i)} class={item.active && 'slick-active'}><button type="button">{i}</button></li>
				{/each}
			</ul> -->
			</div>
			{/if}


			<div class="row">
				<div class="col-md-3 col-6">
					<!-- client item -->
					<div class="client-item">
						<div class="inner">
							<img src="images/client-1.svg" alt="client-name">
						</div>
					</div>
				</div>
				<div class="col-md-3 col-6">
					<!-- client item -->
					<div class="client-item">
						<div class="inner">
							<img src="images/client-2.svg" alt="client-name">
						</div>
					</div>
				</div>
				<div class="col-md-3 col-6">
					<!-- client item -->
					<div class="client-item">
						<div class="inner">
							<img src="images/client-3.svg" alt="client-name">
						</div>
					</div>
				</div>
				<div class="col-md-3 col-6">
					<!-- client item -->
					<div class="client-item">
						<div class="inner">
							<img src="images/client-4.svg" alt="client-name">
						</div>
					</div>
				</div>
				<div class="col-md-3 col-6">
					<!-- client item -->
					<div class="client-item">
						<div class="inner">
							<img src="images/client-5.svg" alt="client-name">
						</div>
					</div>
				</div>
				<div class="col-md-3 col-6">
					<!-- client item -->
					<div class="client-item">
						<div class="inner">
							<img src="images/client-6.svg" alt="client-name">
						</div>
					</div>
				</div>
				<div class="col-md-3 col-6">
					<!-- client item -->
					<div class="client-item">
						<div class="inner">
							<img src="images/client-7.svg" alt="client-name">
						</div>
					</div>
				</div>
				<div class="col-md-3 col-6">
					<!-- client item -->
					<div class="client-item">
						<div class="inner">
							<img src="images/client-8.svg" alt="client-name">
						</div>
					</div>
				</div>
			</div>

		</div>

	</section>

	<!-- section contact -->
	<section id="contact">

		<div class="container">

			<!-- section title -->
			<h2 class="section-title wow fadeInUp" style="visibility: visible; animation-name: fadeInUp;">Get In Touch</h2>

			<div class="spacer" data-height="60" style="height: 60px;"></div>

			<div class="row">

				<div class="col-md-4">
					<!-- contact info -->
					<div class="contact-info">
						<h3 class="wow fadeInUp" style="visibility: visible; animation-name: fadeInUp;">Let's talk about everything!</h3>
						<p class="wow fadeInUp" style="visibility: visible; animation-name: fadeInUp;">Feel free to send me an <a href={user.toEmail}>email</a>. 👋</p>
					</div>
				</div>

				<div class="col-md-8">
					<img src="images/email.jpeg" />
				</div>

			</div>

		</div>

	</section>

	<div class="spacer" data-height="96" style="height: 96px;"></div>

</main>

<style>
	main.content {
		margin-left: 0;
	}

	#about {
		padding-top: 20px;
	}

	.location {
		display: flex;
		align-items: center;
    justify-content: space-between;
	}
</style>
