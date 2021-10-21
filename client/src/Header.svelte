<script>
  import { query } from './stores.js';
  let search = '';

  const handleSearch = () => {
    query.set(search);
  }
</script>

<header>
	<div class="logo">
		<a href="#">
			HSBC Regonization
		</a>
	</div>
	<div class="search">
		<span class="search-icon"></span>
		<input type="text" placeholder="Search..." bind:value={search} />
		<button class="button button-primary" on:click={handleSearch}>Search</button>
	</div>
</header>

<style>
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
</style>
