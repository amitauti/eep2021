<script>
  import { getContext } from 'svelte';
  import Surprise from './Surprise.svelte';

  const { open } = getContext('simple-modal');

  const showSurprise = (content) => () => {
    open(Surprise, { message: content });
  };
</script>

<div class="row">

  <div class="col-md-3 col-sm-6">
    <!-- fact item -->
    <div class="fact-item" on:click={showSurprise('seven')}>
      <span class="icon icon-fire"></span>
      <div class="details">
        <h3 class="mb-0 mt-0 number"><em class="count">198</em></h3>
        <p class="mb-0">Projects completed</p>
      </div>
    </div>
    <div class="spacer d-md-none d-lg-none" data-height="30" style="height: 30px;"></div>
  </div>

  <div class="col-md-3 col-sm-6">
    <!-- fact item -->
    <div class="fact-item" on:click={showSurprise('amit')}>
      <span class="icon icon-cup"></span>
      <div class="details">
        <h3 class="mb-0 mt-0 number"><em class="count">5670</em></h3>
        <p class="mb-0">Cup of coffee</p>
      </div>
    </div>
    <div class="spacer d-md-none d-lg-none" data-height="30" style="height: 30px;"></div>
  </div>

  <div class="col-md-3 col-sm-6">
    <!-- fact item -->
    <div class="fact-item" on:click={showSurprise('alice')}>
      <span class="icon icon-people"></span>
      <div class="details">
        <h3 class="mb-0 mt-0 number"><em class="count">427</em></h3>
        <p class="mb-0">Satisfied clients</p>
      </div>
    </div>
    <div class="spacer d-md-none d-lg-none" data-height="30" style="height: 30px;"></div>
  </div>

  <div class="col-md-3 col-sm-6">
    <!-- fact item -->
    <div class="fact-item" on:click={showSurprise('sunil')}>
      <span class="icon icon-badge"></span>
      <div class="details">
        <h3 class="mb-0 mt-0 number"><em class="count">35</em></h3>
        <p class="mb-0">Nominees winner</p>
      </div>
    </div>
  </div>

</div>
