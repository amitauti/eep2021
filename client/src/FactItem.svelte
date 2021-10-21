<script>
  export let degreedResponse;

  console.log(degreedResponse, 'seven');;

</script>

<div class="row">

  <div class="col-md-3 col-sm-6">
    <!-- fact item -->
    <div class="fact-item" on:click={showSurprise('seven')}>
      <span class="icon icon-trophy"></span>
      <div class="details">
        <h3 class="mb-0 mt-0 number"><em class="count">{degreedResponse?.awards?.length}</em></h3>
        <p class="mb-0">Awards win</p>
      </div>
    </div>
    <div class="spacer d-md-none d-lg-none" data-height="30" style="height: 30px;"></div>
  </div>


  <div class="col-md-3 col-sm-6">
    <!-- fact item -->
    <div class="fact-item" on:click={showSurprise('alice')}>
      <span class="icon icon-badge"></span>
      <div class="details">
        <h3 class="mb-0 mt-0 number"><em class="count">427</em></h3>
        <p class="mb-0">Centification gain</p>
      </div>
    </div>
    <div class="spacer d-md-none d-lg-none" data-height="30" style="height: 30px;"></div>
  </div>

  <div class="col-md-3 col-sm-6">
    <!-- fact item -->
    <div class="fact-item" on:click={showSurprise('amit')}>
      <span class="icon icon-graduation"></span>
      <div class="details">
        <h3 class="mb-0 mt-0 number"><em class="count">5670</em></h3>
        <p class="mb-0">Degree completed</p>
      </div>
    </div>
    <div class="spacer d-md-none d-lg-none" data-height="30" style="height: 30px;"></div>
  </div>

  <div class="col-md-3 col-sm-6">
    <!-- fact item -->
    <div class="fact-item" on:click={showSurprise('sunil')}>
      <span class="icon icon-shield"></span>
      <div class="details">
        <h3 class="mb-0 mt-0 number"><em class="count">35</em></h3>
        <p class="mb-0">Badges</p>
      </div>
    </div>
  </div>

</div>
