let params = X.queryParams();

let testId = params.testId || '';
let cid = params.cid || 'default';

let profiles = {
	sg: '324193813',
	zs: '432538843781412619',
	ko: '733454102',
	jl: '539760020'
};
if (profiles[cid]) {
	cid = profiles[cid];
}

if (testId) {

	document.write(`
		<script src="/data/lolomo_${ cid }.js"></script>

		<script type="module"> 
			import XPanelTag from "/tags/_common/XPanelTag.js"; 
			let xpanel = new XPanelTag("body", { testId: '` + testId + `' }); 

			import AppTag from "/tags/` + testId + `/AppTag.js"; 
			let app = new AppTag("#app"); 
			
		</script>
	`);

} else {

	$('#app').append(jml`

		<"menu">
		   <a href="/?testId=battleKitty">Battle Kitty</a>
		   <a href="/?testId=search">Search OSK</a>
		   <a href="/?testId=eleven">Eleven</a>
		   <a href="/?testId=wowse">Wowse (Watch & Browse)</a>
		   <a href="/?testId=appload">App Load</a>
		   <a href="/?testId=layerCake&fSugarFree=0&fSmallerCards=0&fBanana=1">Layer Cake</a>
		   <a href="/?testId=layerCake">Layer Cake (Sugar Free)</a>
		   <a href="/?testId=onNow">On Now</a>
		   <a href="/?testId=zap">On Now (Zap)</a>
		   <a href="/?testId=couch">Friends on a Couch</a>
		   <a href="/?testId=storyBotsMusic">Story Bots Play-a-long</a>
		   <a href="/?testId=myChannel">My Channel</a>
		</>
	
	`);

	X.css(`

		.menu {
			width: 20rem;
			display: block;
			margin: 2rem auto;
		}
		a {
			padding: 0.5rem;
			border-radius: 0.2rem;
			border: solid 1px #333;
			display: block;
			margin-top: -2px;
			background-color: #000;
			font-size: 90%;
			color: #999;
			font-weight: bold;
			text-align: center;
		}
		a:hover {
			color: #fff;
			background-color: #111;
		}
	`);

}

