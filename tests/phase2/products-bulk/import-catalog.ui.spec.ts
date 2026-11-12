import {test,importCSV} from './support/catalog';
test('F02-j valid two-row CSV imports and survives catalogue reload with correct prices',async({page},info)=>importCSV(page,info));
test('F02-j invalid empty-name CSV rows are rejected or skipped without creating products',async({page},info)=>importCSV(page,info,true));
test('F02-j standard CRLF CSV preserves quoted commas quotes and leading-zero barcodes',async({page},info)=>importCSV(page,info,false,true));
