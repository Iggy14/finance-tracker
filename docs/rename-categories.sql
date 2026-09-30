-- Run once in the Supabase SQL editor to carry existing entries over to the renamed categories.
update entries set category = 'Groceries'      where category = 'Clothing';
update entries set category = 'Skin & Health'  where category = 'Health';
