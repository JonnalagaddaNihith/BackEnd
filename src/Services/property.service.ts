import { RowDataPacket, ResultSetHeader } from 'mysql2';
import { executeQuery } from '../Config/db.config';
import { base64ToBuffer, bufferToBase64, rowExists } from '../Config/utils';
import {
  Property,
  PropertyCreateDTO,
  PropertyUpdateDTO,
  PropertyResponseDTO,
  PropertyFilterDTO,
} from '../Models/Property';

export class PropertyService {
  static async createProperty(propertyData: PropertyCreateDTO): Promise<PropertyResponseDTO> {
    try {
      // Convert base64 photos to Buffer
      const photo1Buffer = propertyData.photo1 ? base64ToBuffer(propertyData.photo1) : null;
      const photo2Buffer = propertyData.photo2 ? base64ToBuffer(propertyData.photo2) : null;
      const photo3Buffer = propertyData.photo3 ? base64ToBuffer(propertyData.photo3) : null;
      const photo4Buffer = propertyData.photo4 ? base64ToBuffer(propertyData.photo4) : null;

      const result = await executeQuery<ResultSetHeader>(
        `INSERT INTO Properties 
         (owner_id, title, property_description, rent_per_day, location, amenities, photo1, photo2, photo3, photo4) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          propertyData.owner_id,
          propertyData.title,
          propertyData.property_description || null,
          propertyData.rent_per_day,
          propertyData.location,
          propertyData.amenities || null,
          photo1Buffer,
          photo2Buffer,
          photo3Buffer,
          photo4Buffer,
        ]
      );

      return await this.getPropertyById(result.insertId);
    } catch (error: any) {
      console.error('❌ PropertyService.createProperty error:', error.message);
      throw error;
    }
  }

  static async getPropertyById(propertyId: number): Promise<PropertyResponseDTO> {
    try {
      const [property] = await executeQuery<RowDataPacket[]>(
        'SELECT * FROM Properties WHERE id = ?',
        [propertyId]
      );

      if (!property) {
        throw new Error('Property not found');
      }

      // Convert Buffer photos to base64
      return {
        id: property.id,
        owner_id: property.owner_id,
        title: property.title,
        property_description: property.property_description,
        rent_per_day: property.rent_per_day,
        location: property.location,
        amenities: property.amenities,
        photo1: bufferToBase64(property.photo1),
        photo2: bufferToBase64(property.photo2),
        photo3: bufferToBase64(property.photo3),
        photo4: bufferToBase64(property.photo4),
        created_at: property.created_at,
      };
    } catch (error: any) {
      console.error('❌ PropertyService.getPropertyById error:', error.message);
      throw error;
    }
  }


  static async getAllProperties(filters?: PropertyFilterDTO): Promise<PropertyResponseDTO[]> {
    try {
      let query = 'SELECT * FROM Properties WHERE 1=1';
      const queryParams: any[] = [];

      // Apply filters
      if (filters?.location) {
        query += ' AND location LIKE ?';
        queryParams.push(`%${filters.location}%`);
      }

      if (filters?.min_rent !== undefined) {
        query += ' AND rent_per_day >= ?';
        queryParams.push(filters.min_rent);
      }

      if (filters?.max_rent !== undefined) {
        query += ' AND rent_per_day <= ?';
        queryParams.push(filters.max_rent);
      }

      if (filters?.amenities) {
        query += ' AND amenities LIKE ?';
        queryParams.push(`%${filters.amenities}%`);
      }

      query += ' ORDER BY created_at DESC';

      const properties = await executeQuery<RowDataPacket[]>(query, queryParams);

      // Convert all photos to base64
      return properties.map((property) => ({
        id: property.id,
        owner_id: property.owner_id,
        title: property.title,
        property_description: property.property_description,
        rent_per_day: property.rent_per_day,
        location: property.location,
        amenities: property.amenities,
        photo1: bufferToBase64(property.photo1),
        photo2: bufferToBase64(property.photo2),
        photo3: bufferToBase64(property.photo3),
        photo4: bufferToBase64(property.photo4),
        created_at: property.created_at,
      }));
    } catch (error: any) {
      console.error('❌ PropertyService.getAllProperties error:', error.message);
      throw error;
    }
  }


  static async getPropertiesByOwner(ownerId: number): Promise<PropertyResponseDTO[]> {
    try {
      const properties = await executeQuery<RowDataPacket[]>(
        'SELECT * FROM Properties WHERE owner_id = ? ORDER BY created_at DESC',
        [ownerId]
      );

      return properties.map((property) => ({
        id: property.id,
        owner_id: property.owner_id,
        title: property.title,
        property_description: property.property_description,
        rent_per_day: property.rent_per_day,
        location: property.location,
        amenities: property.amenities,
        photo1: bufferToBase64(property.photo1),
        photo2: bufferToBase64(property.photo2),
        photo3: bufferToBase64(property.photo3),
        photo4: bufferToBase64(property.photo4),
        created_at: property.created_at,
      }));
    } catch (error: any) {
      console.error('❌ PropertyService.getPropertiesByOwner error:', error.message);
      throw error;
    }
  }


  static async updateProperty(
    propertyId: number,
    ownerId: number,
    updates: PropertyUpdateDTO
  ): Promise<PropertyResponseDTO> {
    try {
      // Check if property exists and belongs to owner
      const [existingProperty] = await executeQuery<RowDataPacket[]>(
        'SELECT * FROM Properties WHERE id = ? AND owner_id = ?',
        [propertyId, ownerId]
      );

      if (!existingProperty) {
        throw new Error('Property not found or you do not have permission to update it');
      }
      const updateFields: string[] = [];
      const updateValues: any[] = [];

      if (updates.title !== undefined) {
        updateFields.push('title = ?');
        updateValues.push(updates.title);
      }

      if (updates.property_description !== undefined) {
        updateFields.push('property_description = ?');
        updateValues.push(updates.property_description);
      }

      if (updates.rent_per_day !== undefined) {
        updateFields.push('rent_per_day = ?');
        updateValues.push(updates.rent_per_day);
      }

      if (updates.location !== undefined) {
        updateFields.push('location = ?');
        updateValues.push(updates.location);
      }

      if (updates.amenities !== undefined) {
        updateFields.push('amenities = ?');
        updateValues.push(updates.amenities);
      }

      // Handle photo updates
      if (updates.photo1 !== undefined) {
        updateFields.push('photo1 = ?');
        updateValues.push(updates.photo1 ? base64ToBuffer(updates.photo1) : null);
      }

      if (updates.photo2 !== undefined) {
        updateFields.push('photo2 = ?');
        updateValues.push(updates.photo2 ? base64ToBuffer(updates.photo2) : null);
      }

      if (updates.photo3 !== undefined) {
        updateFields.push('photo3 = ?');
        updateValues.push(updates.photo3 ? base64ToBuffer(updates.photo3) : null);
      }

      if (updates.photo4 !== undefined) {
        updateFields.push('photo4 = ?');
        updateValues.push(updates.photo4 ? base64ToBuffer(updates.photo4) : null);
      }

      if (updateFields.length === 0) {
        throw new Error('No fields to update');
      }

      updateValues.push(propertyId);

      await executeQuery(
        `UPDATE Properties SET ${updateFields.join(', ')} WHERE id = ?`,
        updateValues
      );

      return await this.getPropertyById(propertyId);
    } catch (error: any) {
      console.error('❌ PropertyService.updateProperty error:', error.message);
      throw error;
    }
  }


  static async deleteProperty(propertyId: number, ownerId: number): Promise<void> {
    try {
      const result = await executeQuery<ResultSetHeader>(
        'DELETE FROM Properties WHERE id = ? AND owner_id = ?',
        [propertyId, ownerId]
      );

      if (result.affectedRows === 0) {
        throw new Error('Property not found or you do not have permission to delete it');
      }
    } catch (error: any) {
      console.error('❌ PropertyService.deleteProperty error:', error.message);
      throw error;
    }
  }
}
