<script>
	export let name;
	import Content from './Content.svelte';
	import FactItem from './FactItem.svelte';
	import Award from './Award.svelte';
	import Degreed from './Degreed.svelte';
	import Certification from './Certification.svelte';
  import Modal from 'svelte-simple-modal';
	import { Tabs, Tab, TabList, TabPanel } from 'svelte-tabs';
	import ProgressBar from '@okrad/svelte-progressbar';

	let user = {};
	let series = [{
		perc: 0,
		color: '#2196f3'
	}];

	fetch('http://localhost:3000/profiles/1').then(res => res.json()).then(res => {
		// console.log(res);
		user = res.response;
		user.skillsFormat = user.skills.slice(0, -1).join(', ');
		// console.log(user.degreedResponse);
		// console.log(user?.degreedResponse?.awards?.length);
		user.awards = user?.degreedResponse?.awards?.length;
		console.log(user);
		series = [{
			perc: user.profilescore,
			color: '#2196f3'
		}];
		// console.log(user.skills);
		// user.lastSkill = user.skills[-1];
	})


	//
	// setTimeout(() => {
	// 	series = [{
	// 		perc: 77,
	// 		color: '#2196f3'
	// 	}]
	// }, 1000);

</script>

<header>
	<div class="logo">
		<a href="#">
			HSBC Regonization
		</a>
	</div>
	<div class="search">
		<span class="search-icon"></span>
		<input type="text" placeholder="Search...">
		<button class="button button-primary">Search</button>
	</div>
</header>
<main class="content">
	<!-- section home -->
	<!-- <section id="home" class="home d-flex align-items-center">
		<div class="container">

			intro
			<div class="intro">
				avatar image
				<img src="images/avatar-1.svg" alt="Bolby" class="mb-4">

				info
				<h1 class="mb-2 mt-0">Bolby Doe</h1>
				<span>I'm a <span class="text-rotating morphext"><span class="animated bounceIn">Front-End developer</span></span></span>

				social icons
				<ul class="social-icons light list-inline mb-0 mt-4">
					<li class="list-inline-item"><a href="#"><i class="fab fa-instagram"></i></a></li>
					<li class="list-inline-item"><a href="#"><i class="fab fa-twitter"></i></a></li>
					<li class="list-inline-item"><a href="#"><i class="fab fa-behance"></i></a></li>
					<li class="list-inline-item"><a href="#"><i class="fab fa-dribbble"></i></a></li>
					<li class="list-inline-item"><a href="#"><i class="fab fa-pinterest-p"></i></a></li>
				</ul>

				buttons
				<div class="mt-4">
					<a href="#contact" class="btn btn-default">Hire me</a>
				</div>
			</div>

			scroll down mouse wheel
			<div class="scroll-down">
				<a href="#about" class="mouse-wrapper">
					<span>Scroll Down</span>
					<span class="mouse">
						<span class="wheel"></span>
					</span>
				</a>
			</div>

			parallax layers
			<div class="parallax" data-relative-input="true" style="transform: translate3d(0px, 0px, 0px); transform-style: preserve-3d; backface-visibility: hidden;">

				<svg width="27" height="29" data-depth="0.3" class="layer p1" xmlns="http://www.w3.org/2000/svg" style="transform: translate3d(0.54px, -23.5939px, 0px); transform-style: preserve-3d; backface-visibility: hidden; position: relative; display: block;"><path d="M21.15625.60099c4.37954 3.67487 6.46544 9.40612 5.47254 15.03526-.9929 5.62915-4.91339 10.30141-10.2846 12.25672-5.37122 1.9553-11.3776.89631-15.75715-2.77856l2.05692-2.45134c3.50315 2.93948 8.3087 3.78663 12.60572 2.22284 4.297-1.5638 7.43381-5.30209 8.22768-9.80537.79387-4.50328-.8749-9.08872-4.37803-12.02821L21.15625.60099z" fill="#FFD15C" fill-rule="evenodd"></path></svg>

				<svg width="26" height="26" data-depth="0.2" class="layer p2" xmlns="http://www.w3.org/2000/svg" style="transform: translate3d(0.36px, -15.7293px, 0px); transform-style: preserve-3d; backface-visibility: hidden; position: absolute; display: block;"><path d="M13 3.3541L2.42705 24.5h21.1459L13 3.3541z" stroke="#FF4C60" stroke-width="3" fill="none" fill-rule="evenodd"></path></svg>

				<svg width="30" height="25" data-depth="0.3" class="layer p3" xmlns="http://www.w3.org/2000/svg" style="transform: translate3d(0.54px, -23.5939px, 0px); transform-style: preserve-3d; backface-visibility: hidden; position: absolute; display: block;"><path d="M.1436 8.9282C3.00213 3.97706 8.2841.92763 14.00013.92796c5.71605.00032 10.9981 3.04992 13.85641 8 2.8583 4.95007 2.8584 11.0491-.00014 16.00024l-2.77128-1.6c2.28651-3.96036 2.28631-8.84002.00011-12.8002-2.2862-3.96017-6.5124-6.40017-11.08513-6.4-4.57271.00018-8.79872 2.43984-11.08524 6.4002l-2.77128-1.6z" fill="#44D7B6" fill-rule="evenodd"></path></svg>

				<svg width="15" height="23" data-depth="0.6" class="layer p4" xmlns="http://www.w3.org/2000/svg" style="transform: translate3d(1.08px, -47.1878px, 0px); transform-style: preserve-3d; backface-visibility: hidden; position: absolute; display: block;"><rect transform="rotate(30 9.86603 10.13397)" x="7" width="3" height="25" rx="1.5" fill="#FFD15C" fill-rule="evenodd"></rect></svg>

				<svg width="15" height="23" data-depth="0.2" class="layer p5" xmlns="http://www.w3.org/2000/svg" style="transform: translate3d(0.36px, -15.7293px, 0px); transform-style: preserve-3d; backface-visibility: hidden; position: absolute; display: block;"><rect transform="rotate(30 9.86603 10.13397)" x="7" width="3" height="25" rx="1.5" fill="#6C6CE5" fill-rule="evenodd"></rect></svg>

				<svg width="49" height="17" data-depth="0.5" class="layer p6" xmlns="http://www.w3.org/2000/svg" style="transform: translate3d(0.9px, -39.3232px, 0px); transform-style: preserve-3d; backface-visibility: hidden; position: absolute; display: block;"><g fill="#FF4C60" fill-rule="evenodd"><path d="M.5 16.5c0-5.71709 2.3825-10.99895 6.25-13.8567 3.8675-2.85774 8.6325-2.85774 12.5 0C23.1175 5.50106 25.5 10.78292 25.5 16.5H23c0-4.57303-1.90625-8.79884-5-11.08535-3.09375-2.28652-6.90625-2.28652-10 0C4.90625 7.70116 3 11.92697 3 16.5H.5z"></path><path d="M23.5 16.5c0-5.71709 2.3825-10.99895 6.25-13.8567 3.8675-2.85774 8.6325-2.85774 12.5 0C46.1175 5.50106 48.5 10.78292 48.5 16.5H46c0-4.57303-1.90625-8.79884-5-11.08535-3.09375-2.28652-6.90625-2.28652-10 0-3.09375 2.28651-5 6.51232-5 11.08535h-2.5z"></path></g></svg>

				<svg width="26" height="26" data-depth="0.4" class="layer p7" xmlns="http://www.w3.org/2000/svg" style="transform: translate3d(0.72px, -31.4585px, 0px); transform-style: preserve-3d; backface-visibility: hidden; position: absolute; display: block;"><path d="M13 22.6459L2.42705 1.5h21.1459L13 22.6459z" stroke="#FFD15C" stroke-width="3" fill="none" fill-rule="evenodd"></path></svg>

				<svg width="19" height="21" data-depth="0.3" class="layer p8" xmlns="http://www.w3.org/2000/svg" style="transform: translate3d(0.54px, -23.5939px, 0px); transform-style: preserve-3d; backface-visibility: hidden; position: absolute; display: block;"><rect transform="rotate(-40 6.25252 10.12626)" x="7" width="3" height="25" rx="1.5" fill="#6C6CE5" fill-rule="evenodd"></rect></svg>

				<svg width="30" height="25" data-depth="0.3" data-depth-y="-1.30" class="layer p9" xmlns="http://www.w3.org/2000/svg" style="transform: translate3d(0.54px, -23.5939px, 0px); transform-style: preserve-3d; backface-visibility: hidden; position: absolute; display: block;"><path d="M29.8564 16.0718c-2.85854 4.95114-8.1405 8.00057-13.85654 8.00024-5.71605-.00032-10.9981-3.04992-13.85641-8-2.8583-4.95007-2.8584-11.0491.00014-16.00024l2.77128 1.6c-2.28651 3.96036-2.28631 8.84002-.00011 12.8002 2.2862 3.96017 6.5124 6.40017 11.08513 6.4 4.57271-.00018 8.79872-2.43984 11.08524-6.4002l2.77128 1.6z" fill="#6C6CE5" fill-rule="evenodd"></path></svg>

				<svg width="47" height="29" data-depth="0.2" class="layer p10" xmlns="http://www.w3.org/2000/svg" style="transform: translate3d(0.36px, -15.7293px, 0px); transform-style: preserve-3d; backface-visibility: hidden; position: absolute; display: block;"><g fill="#44D7B6" fill-rule="evenodd"><path d="M46.78878 17.19094c-1.95535 5.3723-6.00068 9.52077-10.61234 10.8834-4.61167 1.36265-9.0893-.26708-11.74616-4.27524-2.65686-4.00817-3.08917-9.78636-1.13381-15.15866l2.34923.85505c-1.56407 4.29724-1.2181 8.92018.90705 12.12693 2.12514 3.20674 5.70772 4.5107 9.39692 3.4202 3.68921-1.0905 6.92581-4.40949 8.48988-8.70673l2.34923.85505z"></path><path d="M25.17585 9.32448c-1.95535 5.3723-6.00068 9.52077-10.61234 10.8834-4.61167 1.36264-9.0893-.26708-11.74616-4.27525C.16049 11.92447-.27182 6.14628 1.68354.77398l2.34923.85505c-1.56407 4.29724-1.2181 8.92018.90705 12.12692 2.12514 3.20675 5.70772 4.5107 9.39692 3.4202 3.68921-1.0905 6.92581-4.40948 8.48988-8.70672l2.34923.85505z"></path></g></svg>

				<svg width="33" height="20" data-depth="0.5" class="layer p11" xmlns="http://www.w3.org/2000/svg" style="transform: translate3d(0.9px, -39.3232px, 0px); transform-style: preserve-3d; backface-visibility: hidden; position: absolute; display: block;"><path d="M32.36774.34317c.99276 5.63023-1.09332 11.3614-5.47227 15.03536-4.37895 3.67396-10.3855 4.73307-15.75693 2.77837C5.76711 16.2022 1.84665 11.53014.8539 5.8999l3.15139-.55567c.7941 4.50356 3.93083 8.24147 8.22772 9.8056 4.29688 1.56413 9.10275.71673 12.60554-2.2227C28.34133 9.98771 30.01045 5.4024 29.21635.89884l3.15139-.55567z" fill="#FFD15C" fill-rule="evenodd"></path></svg>

			</div>
		</div>

	</section> -->

	<!-- section about -->
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
							<!-- <div class="col-md-6">
								skill item
								<div class="skill-item">
									<div class="skill-info clearfix">
										<h4 class="float-left mb-3 mt-0">Development</h4>
										<span class="float-right">85%</span>
									</div>
									<div class="progress">
										<div class="progress-bar data-background" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="85" data-color="#FFD15C" style="background-color: rgb(255, 209, 92); width: 85%;">
										</div>
									</div>
									<div class="spacer" data-height="20" style="height: 20px;"></div>
								</div>

								skill item
								<div class="skill-item">
									<div class="skill-info clearfix">
										<h4 class="float-left mb-3 mt-0">UI/UX design</h4>
										<span class="float-right">95%</span>
									</div>
									<div class="progress">
										<div class="progress-bar data-background" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="95" data-color="#FF4C60" style="background-color: rgb(255, 76, 96); width: 95%;">
										</div>
									</div>
									<div class="spacer" data-height="20" style="height: 20px;"></div>
								</div>

								skill item
								<div class="skill-item">
									<div class="skill-info clearfix">
										<h4 class="float-left mb-3 mt-0">Photography</h4>
										<span class="float-right">70%</span>
									</div>
									<div class="progress">
										<div class="progress-bar data-background" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="70" data-color="#6C6CE5" style="background-color: rgb(108, 108, 229); width: 70%;">
										</div>
									</div>
								</div>
							</div> -->
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
<!--
	section prices
	<section id="prices">

		<div class="container">

			section title
			<h2 class="section-title wow fadeIn" style="visibility: visible; animation-name: fadeIn;">Pricing Plans</h2>

			<div class="spacer" data-height="60" style="height: 60px;"></div>

			<div class="row">

				<div class="col-md-4 pr-md-0 mt-md-4 mt-0">
					price item
					<div class="price-item bg-white rounded shadow-dark text-center">
						<img src="images/price-1.svg" alt="Regular">
						<h2 class="plan">Basic</h2>
						<p>A Simple option but powerful to manage your business</p>
						<p>Email support</p>
						<h3 class="price"><em>$</em>9<span>Month</span></h3>
						<a href="#" class="btn btn-default">Get Started</a>
					</div>
				</div>

				<div class="col-md-4 px-md-0 my-4 my-md-0">
					price item recommended
					<div class="price-item bg-white rounded shadow-dark text-center best">
						<span class="badge">Recommended</span>
						<img src="images/price-2.svg" alt="Premium">
						<h2 class="plan">Premium</h2>
						<p>Unlimited product including apps integrations and more features</p>
						<p>Mon-Fri support</p>
						<h3 class="price"><em>$</em>49<span>Month</span></h3>
						<a href="#" class="btn btn-default">Get Started</a>
					</div>
				</div>

				<div class="col-md-4 pl-md-0 mt-md-4 mt-0">
					price item
					<div class="price-item bg-white rounded shadow-dark text-center">
						<img src="images/price-3.svg" alt="Ultimate">
						<h2 class="plan">Ultimate</h2>
						<p>A wise option for large companies and individuals</p>
						<p>24/7 support</p>
						<h3 class="price"><em>$</em>99<span>Month</span></h3>
						<a href="#" class="btn btn-default">Get Started</a>
					</div>
				</div>

			</div>

		</div>

	</section> -->

	<!-- section testimonials -->
	<section id="testimonials">

		<div class="container">

			<!-- section title -->
			<h2 class="section-title wow fadeInUp" style="visibility: visible; animation-name: fadeInUp;">Clients &amp; Reviews</h2>

			<div class="spacer" data-height="60" style="height: 60px;"></div>

			<!-- testimonials wrapper -->
			<div class="testimonials-wrapper slick-initialized slick-slider slick-dotted" role="toolbar">

				<!-- testimonial item -->
				<div aria-live="polite" class="slick-list draggable"><div class="slick-track" role="listbox" style="opacity: 1; width: 2800px; transform: translate3d(-700px, 0px, 0px);"><div class="testimonial-item text-center mx-auto slick-slide slick-cloned" data-slick-index="-1" aria-hidden="true" tabindex="-1" style="width: 700px;">
					<div class="thumb mb-3 mx-auto">
						<img src="images/avatar-1.svg" alt="customer-name">
					</div>
					<h4 class="mt-3 mb-0">John Doe</h4>
					<span class="subtitle">Product designer at Dribbble</span>
					<div class="bg-white padding-30 shadow-dark rounded triangle-top position-relative mt-4">
						<p class="mb-0">I enjoy working with the theme and learn so much. You guys make the process fun and interesting. Good luck! 🔥</p>
					</div>
				</div><div class="testimonial-item text-center mx-auto slick-slide slick-current slick-active" data-slick-index="0" aria-hidden="false" tabindex="-1" role="option" aria-describedby="slick-slide00" style="width: 700px;">
					<div class="thumb mb-3 mx-auto">
						<img src="images/avatar-3.svg" alt="customer-name">
					</div>
					<h4 class="mt-3 mb-0">John Doe</h4>
					<span class="subtitle">Product designer at Dribbble</span>
					<div class="bg-white padding-30 shadow-dark rounded triangle-top position-relative mt-4">
						<p class="mb-0">I enjoy working with the theme and learn so much. You guys make the process fun and interesting. Good luck! 👍</p>
					</div>
				</div><div class="testimonial-item text-center mx-auto slick-slide" data-slick-index="1" aria-hidden="true" tabindex="-1" role="option" aria-describedby="slick-slide01" style="width: 700px;">
					<div class="thumb mb-3 mx-auto">
						<img src="images/avatar-1.svg" alt="customer-name">
					</div>
					<h4 class="mt-3 mb-0">John Doe</h4>
					<span class="subtitle">Product designer at Dribbble</span>
					<div class="bg-white padding-30 shadow-dark rounded triangle-top position-relative mt-4">
						<p class="mb-0">I enjoy working with the theme and learn so much. You guys make the process fun and interesting. Good luck! 🔥</p>
					</div>
				</div><div class="testimonial-item text-center mx-auto slick-slide slick-cloned" data-slick-index="2" aria-hidden="true" tabindex="-1" style="width: 700px;">
					<div class="thumb mb-3 mx-auto">
						<img src="images/avatar-3.svg" alt="customer-name">
					</div>
					<h4 class="mt-3 mb-0">John Doe</h4>
					<span class="subtitle">Product designer at Dribbble</span>
					<div class="bg-white padding-30 shadow-dark rounded triangle-top position-relative mt-4">
						<p class="mb-0">I enjoy working with the theme and learn so much. You guys make the process fun and interesting. Good luck! 👍</p>
					</div>
				</div></div></div>

				<!-- testimonial item -->


			<ul class="slick-dots" style="display: block;" role="tablist"><li class="slick-active" aria-hidden="false" role="presentation" aria-selected="true" aria-controls="navigation00" id="slick-slide00"><button type="button" data-role="none" role="button" tabindex="0">1</button></li><li aria-hidden="true" role="presentation" aria-selected="false" aria-controls="navigation01" id="slick-slide01" class=""><button type="button" data-role="none" role="button" tabindex="0">2</button></li></ul></div>

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

	<!-- section blog -->
	<section id="blog">

		<div class="container">

			<!-- section title -->
			<h2 class="section-title wow fadeInUp" style="visibility: visible; animation-name: fadeInUp;">Latest Posts</h2>

			<div class="spacer" data-height="60" style="height: 60px;"></div>

			<div class="row blog-wrapper">

				<div class="col-md-4">
					<!-- blog item -->
					<div class="blog-item rounded bg-white shadow-dark wow fadeIn" data-wow-delay="200ms" style="visibility: visible; animation-delay: 200ms; animation-name: fadeIn;">
						<div class="thumb">
							<a href="#">
								<span class="category">Reviews</span>
							</a>
							<a href="#">
								<img src="images/blog/1.svg" alt="blog-title">
							</a>
						</div>
						<div class="details">
							<h4 class="my-0 title"><a href="#">5 Best App Development Tool for Your Project</a></h4>
							<ul class="list-inline meta mb-0 mt-2">
								<li class="list-inline-item">09 February, 2020</li>
								<li class="list-inline-item">Bolby</li>
							</ul>
						</div>
					</div>
				</div>

				<div class="col-md-4">
					<!-- blog item -->
					<div class="blog-item rounded bg-white shadow-dark wow fadeIn" data-wow-delay="400ms" style="visibility: visible; animation-delay: 400ms; animation-name: fadeIn;">
						<div class="thumb">
							<a href="#">
								<span class="category">Tutorial</span>
							</a>
							<a href="#">
								<img src="images/blog/2.svg" alt="blog-title">
							</a>
						</div>
						<div class="details">
							<h4 class="my-0 title"><a href="#">Common Misconceptions About Payment</a></h4>
							<ul class="list-inline meta mb-0 mt-2">
								<li class="list-inline-item">07 February, 2020</li>
								<li class="list-inline-item">Bolby</li>
							</ul>
						</div>
					</div>
				</div>

				<div class="col-md-4">
					<!-- blog item -->
					<div class="blog-item rounded bg-white shadow-dark wow fadeIn" data-wow-delay="600ms" style="visibility: visible; animation-delay: 600ms; animation-name: fadeIn;">
						<div class="thumb">
							<a href="#">
								<span class="category">Business</span>
							</a>
							<a href="#">
								<img src="images/blog/3.svg" alt="blog-title">
							</a>
						</div>
						<div class="details">
							<h4 class="my-0 title"><a href="#">3 Things To Know About Startup Business</a></h4>
							<ul class="list-inline meta mb-0 mt-2">
								<li class="list-inline-item">06 February, 2020</li>
								<li class="list-inline-item">Bolby</li>
							</ul>
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
						<p class="wow fadeInUp" style="visibility: visible; animation-name: fadeInUp;">Feel free to send me an <a href="mailto:seven.y.q.guo@hsbc.com.cn">email</a>. 👋</p>
					</div>
				</div>

				<div class="col-md-8">
					<img src="https://www.cloudways.com/blog/wp-content/uploads/Email-Hosting-Small-Business.jpg" />
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

	header {
		display: flex;
    width: 1080px;
    margin: 0 auto;
    align-items: center;
    justify-content: space-between;
		margin-top: 20px;
	}

	header input {
		background-color: #f1f3fa;
    box-shadow: none;
		border: none;
    height: calc(1.5em + .9rem + 2px);
		outline: none;
		width: 300px;
		padding-left: 32px;
	}

	header .search {
		display: flex;
		position: relative;
	}

	.button {
		display: inline-block;
    font-weight: 400;
    line-height: 1.5;
    color: #6c757d;
    text-align: center;
    vertical-align: middle;
    cursor: pointer;
    -webkit-user-select: none;
    -ms-user-select: none;
    user-select: none;
    background-color: transparent;
    border: 1px solid transparent;
    padding: .45rem .9rem;
    font-size: .9rem;
    border-radius: .15rem;
    transition: color .15s ease-in-out,background-color .15s ease-in-out,border-color .15s ease-in-out,box-shadow .15s ease-in-out;
	}

	.button-primary {
    color: #fff;
    background-color: #727cf5;
    border-color: #727cf5;
		box-shadow: 0 2px 6px 0 rgb(114 124 245 / 50%);
	}

	#about {
		padding-top: 20px;
	}

	header .logo {
		font-size: 36px;
    font-family: "Rubik", sans-serif;
    font-weight: 700;
	}

	header .logo a {
		color: #6f6ab7;
	}

	.search-icon {
		position: absolute;
		top: 3px;
    left: 7px;
    font-size: 22px;
	}

	.search-icon::before {
		display: inline-block;
		content: "\F0349";
    font: normal normal normal 24px/1 "Material Design Icons";
    font-size: inherit;
    text-rendering: auto;
    line-height: inherit;
    -webkit-font-smoothing: antialiased;
	}
	.location {
		display: flex;
		align-items: center;
    justify-content: space-between;
	}
</style>
