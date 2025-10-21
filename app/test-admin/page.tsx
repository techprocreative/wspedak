"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Package, Plus, Edit, Trash2, TestTube } from "lucide-react";

interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  stock: number;
  image_url: string | null;
  created_at: string;
}

export default function TestAdminPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [testData, setTestData] = useState({
    name: "Test Product",
    description: "This is a test product",
    price: "99.99",
    stock: "50",
  });

  // Test: Read Products
  const testReadProducts = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        toast.error("❌ Read Error: " + error.message);
      } else {
        setProducts(data || []);
        toast.success(`✅ Successfully read ${data?.length || 0} products`);
      }
    } catch (error) {
      toast.error("❌ Unexpected error reading products");
    }
    setLoading(false);
  };

  // Test: Create Product
  const testCreateProduct = async () => {
    setLoading(true);
    try {
      const productData = {
        name: testData.name,
        description: testData.description,
        price: parseFloat(testData.price),
        stock: parseInt(testData.stock),
        image_url: null,
      };

      const { data, error } = await supabase
        .from("products")
        .insert([productData])
        .select();

      if (error) {
        toast.error("❌ Create Error: " + error.message);
      } else {
        toast.success("✅ Product created successfully!");
        setTestData({
          name: "Test Product",
          description: "This is a test product",
          price: "99.99",
          stock: "50",
        });
        // Refresh products list
        testReadProducts();
      }
    } catch (error) {
      toast.error("❌ Unexpected error creating product");
    }
    setLoading(false);
  };

  // Test: Update Product
  const testUpdateProduct = async (productId: string) => {
    setLoading(true);
    try {
      const updateData = {
        name: `Updated ${testData.name}`,
        price: parseFloat(testData.price) + 10,
      };

      const { error } = await supabase
        .from("products")
        .update(updateData)
        .eq("id", productId);

      if (error) {
        toast.error("❌ Update Error: " + error.message);
      } else {
        toast.success("✅ Product updated successfully!");
        testReadProducts();
      }
    } catch (error) {
      toast.error("❌ Unexpected error updating product");
    }
    setLoading(false);
  };

  // Test: Delete Product
  const testDeleteProduct = async (productId: string, productName: string) => {
    const isConfirmed = window.confirm(
      `Are you sure you want to delete "${productName}"?`,
    );
    if (!isConfirmed) {
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from("products")
        .delete()
        .eq("id", productId);

      if (error) {
        toast.error("❌ Delete Error: " + error.message);
      } else {
        toast.success("✅ Product deleted successfully!");
        testReadProducts();
      }
    } catch (error) {
      toast.error("❌ Unexpected error deleting product");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <TestTube className="h-8 w-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900">
            Admin CRUD Functionality Test
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Test Controls */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Test Controls
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Button
                    onClick={testReadProducts}
                    disabled={loading}
                    variant="outline"
                  >
                    📖 Read Products
                  </Button>
                  <Button
                    onClick={testCreateProduct}
                    disabled={loading}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    ➕ Create Test Product
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Create Test Data</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="testName">Product Name</Label>
                  <Input
                    id="testName"
                    value={testData.name}
                    onChange={(e) =>
                      setTestData({ ...testData, name: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="testDescription">Description</Label>
                  <Input
                    id="testDescription"
                    value={testData.description}
                    onChange={(e) =>
                      setTestData({ ...testData, description: e.target.value })
                    }
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="testPrice">Price (IDR)</Label>
                    <Input
                      id="testPrice"
                      type="number"
                      step="0.01"
                      value={testData.price}
                      onChange={(e) =>
                        setTestData({ ...testData, price: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="testStock">Stock</Label>
                    <Input
                      id="testStock"
                      type="number"
                      value={testData.stock}
                      onChange={(e) =>
                        setTestData({ ...testData, stock: e.target.value })
                      }
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Products List */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>
                  Products ({products.length}) - Test Results
                </CardTitle>
              </CardHeader>
              <CardContent>
                {products.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Package className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>
                      No products loaded. Click &quot;Read Products&quot; to
                      test.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {products.map((product) => (
                      <div
                        key={product.id}
                        className="flex items-center justify-between p-3 border rounded-lg"
                      >
                        <div className="flex-1">
                          <h4 className="font-medium">{product.name}</h4>
                          <p className="text-sm text-gray-600">
                            Rp {(product.price * 1000).toLocaleString()} •{" "}
                            {product.stock} pcs
                          </p>
                          <p className="text-xs text-gray-400">
                            ID: {product.id.slice(0, 8)}...
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => testUpdateProduct(product.id)}
                            disabled={loading}
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() =>
                              testDeleteProduct(product.id, product.name)
                            }
                            disabled={loading}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="mt-8 bg-blue-50 p-6 rounded-xl">
          <h3 className="font-bold text-blue-900 mb-2">
            📋 Test Instructions:
          </h3>
          <ol className="space-y-2 text-blue-800">
            <li>
              1. Click &quot;Read Products&quot; to test READ operation from
              database
            </li>
            <li>
              2. Modify test data and click &quot;Create Test Product&quot; to
              test CREATE operation
            </li>
            <li>
              3. Click the edit icon (📝) on any product to test UPDATE
              operation
            </li>
            <li>
              4. Click the delete icon (🗑️) to test DELETE operation (with
              confirmation)
            </li>
            <li>5. Check toast notifications for success/error messages</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
