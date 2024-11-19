<script lang="ts">
	import * as Sidebar from '$ui/sidebar/index.ts';
	import Theme from './Theme.svelte';

	const useSidebar = Sidebar.useSidebar();

	$effect(() => {
		console.log(useSidebar.open);
	});
</script>

<Sidebar.Root>
	<Sidebar.Header>
		Header
		<Theme />
	</Sidebar.Header>
	<Sidebar.Content class=" shadow-lg">
		<Sidebar.Group>
			<Sidebar.GroupLabel>Application</Sidebar.GroupLabel>
			<Sidebar.GroupContent>
				<Sidebar.Menu>
					<Sidebar.MenuItem>
						<h1>Item</h1>
					</Sidebar.MenuItem>
				</Sidebar.Menu>
			</Sidebar.GroupContent>
		</Sidebar.Group>
		<Sidebar.Group />
		<Sidebar.Trigger
			class="absolute -right-3 top-0 h-full  w-3 rounded-none rounded-r-md bg-primary bg-opacity-50 p-0 "
		/>
	</Sidebar.Content>
</Sidebar.Root>
