import { Component, inject, OnInit } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { ProductService } from '../../../core/services/product.service';
import { Product } from '../../../core/interfaces/product';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { SaveProductDlgComponent } from '../save-product-dlg/save-product-dlg.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-product-home',
  imports: [
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    FormsModule,
    MatInputModule
  ],
  templateUrl: './product-home.component.html',
  styleUrls: ['./product-home.component.scss']
})
export class ProductHomeComponent implements OnInit {
  columns: string[] = ['image', 'name', 'description', 'currency', 'price', 'state', 'action'];
  dataSource: Product[] = []; // Lista completa de productos
  filteredDataSource: Product[] = []; // Lista de productos filtrados

  nameFilter: string = ''; // Filtro por nombre
  stateFilter: number | null = null; // Filtro por estado
  currencyFilter: string = ''; // Filtro por moneda (Soles o Dólar)

  productService = inject(ProductService);
  private dialog = inject(MatDialog);
  private snackbar = inject(MatSnackBar);

  ngOnInit(): void {
    this.getAll();
  }

  getAll(): void {
    // Llamar al servicio con los filtros aplicados
    this.productService.getAll(this.nameFilter, this.stateFilter, this.currencyFilter).subscribe(res => {
      console.log('Api response:', res.data);
      this.dataSource = res.data;
      this.applyFilters(); // Aplica los filtros a los datos
    });
  }

  applyFilters(): void {
    this.filteredDataSource = this.dataSource.filter(product => {
      const matchesName = product.name.toLowerCase().includes(this.nameFilter.toLowerCase());
      const matchesState = this.stateFilter !== null ? product.state === this.stateFilter : true;
      const matchesCurrency = this.currencyFilter ? product.currencyCode === this.currencyFilter : true;
      return matchesName && matchesState && matchesCurrency;
    });
  }

  openProductDlg(product?: Product): void {
    const dialogRef = this.dialog.open(SaveProductDlgComponent, {
      width: '500px',
      data: product
    });

    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.getAll();
      }
    });
  }

  inactiveProduct(id: number) {
    this.productService.inactive(id).subscribe(res => {
      if (res.status) {
        this.getAll();
        this.snackbar.open('Se inactivó el producto', 'Aceptar');
      }
    });
  }
}
