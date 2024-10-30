<script lang="ts">
	import * as Sidebar from '$ui/sidebar/index.ts';
	import Theme from './Theme.svelte';
</script>

<Sidebar.Root>
	<Sidebar.Header>
		Header
		<Theme />
	</Sidebar.Header>
	<Sidebar.Content class="shadow-lg">
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
	</Sidebar.Content>
	<Sidebar.Footer />
</Sidebar.Root>
