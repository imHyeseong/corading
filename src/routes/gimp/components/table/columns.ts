import { renderComponent } from '$ui/data-table';
import type { ColumnDef } from '@tanstack/table-core';
import TetherBtn from './TetherBtn.svelte';

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Price = {
	coin: string;
	price: {
		kor: number;
		intl: number;
	};
	tether: number;
};

export const columns: ColumnDef<Price>[] = [
	{
		accessorKey: 'coin',
		header: 'Coin'
	},
	{
		accessorKey: 'price',
		header: 'Price'
	},
	{
		accessorKey: 'tether',
		header: ({ column }) =>
			renderComponent(TetherBtn, {
				onclick: () => column.toggleSorting(column.getIsSorted() === 'asc')
			})
	}
];
