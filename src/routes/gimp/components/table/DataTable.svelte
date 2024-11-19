<script lang="ts" generics="TData, TValue">
	import {
		type ColumnDef,
		type SortingState,
		type ColumnFiltersState,
		getCoreRowModel,
		getSortedRowModel,
		getFilteredRowModel
	} from '@tanstack/table-core';
	import { createSvelteTable, FlexRender } from '$ui/data-table/index.js';
	import * as Table from '$ui/table/index.js';
	import Input from '$ui/input/input.svelte';

	type DateTableProps<TData, TValue> = {
		columns: ColumnDef<TData, TValue>[];
		data: TData[];
	};

	let { data, columns }: DateTableProps<TData, TValue> = $props();
	let sorting = $state<SortingState>([]);
	let columnFilters = $state<ColumnFiltersState>([]);

	const table = createSvelteTable({
		get data() {
			return data;
		},
		columns,
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		onSortingChange: (updater) => {
			if (typeof updater === 'function') {
				sorting = updater(sorting);
			} else {
				sorting = updater;
			}
		},
		onColumnFiltersChange: (updater) => {
			if (typeof updater === 'function') {
				columnFilters = updater(columnFilters);
			} else {
				columnFilters = updater;
			}
		},
		state: {
			get sorting() {
				return sorting;
			},
			get columnFilters() {
				return columnFilters;
			}
		}
	});
</script>

<div class="w-full space-y-2">
	<Input
		placeholder="Search Coin..."
		value={(table.getColumn('coin')?.getFilterValue() as string) ?? ''}
		onchange={(e) => {
			table.getColumn('coin')?.setFilterValue(e.currentTarget.value);
		}}
		oninput={(e) => {
			table.getColumn('coin')?.setFilterValue(e.currentTarget.value);
		}}
		class="w-40 max-w-sm bg-muted"
	/>

	<div class="w-fit rounded-md border-2">
		<Table.Root>
			<Table.Header class="bg-muted ">
				{#each table.getHeaderGroups() as headerGroup (headerGroup.id)}
					<Table.Row>
						{#each headerGroup.headers as header (header.id)}
							<Table.Head
								class=" justify-center border-r text-center font-bold text-primary/80 last:border-r-0"
							>
								{#if !header.isPlaceholder}
									<FlexRender
										content={header.column.columnDef.header}
										context={header.getContext()}
									/>
								{/if}
							</Table.Head>
						{/each}
					</Table.Row>
				{/each}
			</Table.Header>
			<Table.Body>
				{#each table.getRowModel().rows as row (row.id)}
					<Table.Row data-state={row.getIsSelected() && 'selected'}>
						{#each row.getVisibleCells() as cell (cell.id)}
							{#if cell.column.id != 'price'}
								<Table.Cell class="text-center">
									{#if typeof cell?.getValue() === 'string'}
										<p class="w-16">{cell?.getValue()}</p>
									{:else}
										<p class="w-32">{cell?.getValue()?.toFixed(2)}</p>
									{/if}
								</Table.Cell>
							{:else}
								<Table.Cell class="w-32 text-right">
									<p class="text-primary">{cell?.getValue()?.kor}</p>
									<p class="text-sm">{cell?.getValue()?.intl}</p>
								</Table.Cell>
							{/if}
						{/each}
					</Table.Row>
				{:else}
					<Table.Row>
						<Table.Cell colspan={columns.length} class="h-24 text-center">No results.</Table.Cell>
					</Table.Row>
				{/each}
			</Table.Body>
		</Table.Root>
	</div>
</div>
