<script>
	/**
	 * @typedef {Object} Props
	 * @property {number} a
	 * @property {number} b
	 */

	/** @type {Props} */
	let { a, b } = $props();
</script>

<b>Addition</b>
<p>
	<b>{a}</b> + <b>{b}</b> = <b>{Number(a) + Number(b)}</b>
</p>
